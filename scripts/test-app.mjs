/**
 * Full integration test suite — run with: node scripts/test-app.mjs
 * Requires dev server at http://localhost:3000 and a reachable DATABASE_URL.
 */

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

let cookies = [];
const results = [];

function record(name, passed, detail = "") {
  results.push({ name, passed, detail });
  const icon = passed ? "PASS" : "FAIL";
  console.log(`${icon}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function mergeCookies(response) {
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  for (const raw of setCookies) {
    const name = raw.split("=")[0];
    cookies = cookies.filter((c) => !c.startsWith(`${name}=`));
    cookies.push(raw.split(";")[0]);
  }
}

function cookieHeader() {
  return cookies.join("; ");
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body && !(options.headers || {})["Content-Type"]
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
      Cookie: cookieHeader(),
    },
    redirect: "manual",
  });
  mergeCookies(res);
  return res;
}

async function signInWithCredentials(email, password) {
  const csrfRes = await request("/api/auth/csrf");
  const csrfData = await csrfRes.json();

  const signInRes = await request("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfToken: csrfData.csrfToken,
      email,
      password,
      redirect: "false",
      json: "true",
    }).toString(),
  });

  return signInRes;
}

async function runTests() {
  console.log(`\nTesting Job Board at ${BASE}\n${"=".repeat(50)}\n`);

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "testPass1";
  const testName = "Test User";

  // --- Static checks ---
  try {
    const health = await fetch(BASE);
    record("Server reachable", health.ok || health.status < 500, `status ${health.status}`);
  } catch (e) {
    record("Server reachable", false, String(e.message));
    printSummary();
    process.exit(1);
  }

  // --- Public pages ---
  const publicPages = ["/", "/jobs", "/auth/signin", "/auth/signup"];
  for (const path of publicPages) {
    const res = await request(path);
    record(`GET ${path}`, res.status === 200, `status ${res.status}`);
  }

  const postGuest = await request("/jobs/post");
  record(
    "GET /jobs/post (guest redirects)",
    postGuest.status === 307 || postGuest.status === 302,
    `status ${postGuest.status}`,
  );

  // --- Protected page (unauthenticated) ---
  const dashUnauth = await request("/dashboard");
  record(
    "GET /dashboard (guest redirects)",
    dashUnauth.status === 307 || dashUnauth.status === 302,
    `status ${dashUnauth.status}`,
  );

  // --- Auth providers API ---
  const statusRes = await request("/api/auth/status");
  let status = {};
  try {
    status = await statusRes.json();
  } catch {
    status = { parseError: true };
  }
  record(
    "GET /api/auth/status",
    statusRes.ok && status.credentials === true,
    JSON.stringify(status),
  );

  // --- Signup validation ---
  const badSignup = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name: "A", email: "bad", password: "123" }),
  });
  record("POST /api/auth/signup (invalid data → 400)", badSignup.status === 400);

  // --- Signup success ---
  const signupRes = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  const signupData = await signupRes.json();
  record(
    "POST /api/auth/signup (valid user → 201)",
    signupRes.status === 201 && signupData.userId,
    signupRes.status.toString(),
  );

  // --- Duplicate signup ---
  const dupSignup = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  record("POST /api/auth/signup (duplicate → 400)", dupSignup.status === 400);

  // --- Unauthorized job post ---
  cookies = []; // clear session
  const unauthJob = await request("/api/jobs", {
    method: "POST",
    body: JSON.stringify({
      title: "Should Fail",
      company: "Co",
      location: "Remote",
      type: "Full-time",
      description: "This should not be created without auth.",
    }),
  });
  record("POST /api/jobs (no auth → 401)", unauthJob.status === 401);

  // --- Sign in ---
  const signInRes = await signInWithCredentials(testEmail, testPassword);
  record(
    "POST credentials sign-in",
    signInRes.status === 200 || signInRes.status === 302,
    `status ${signInRes.status}`,
  );

  // --- Session check via dashboard ---
  const dashAuth = await request("/dashboard");
  record(
    "GET /dashboard (authenticated → 200)",
    dashAuth.status === 200,
    `status ${dashAuth.status}`,
  );

  // --- Create job ---
  const jobPayload = {
    title: "Integration Test Engineer",
    company: "Test Corp",
    location: "Remote",
    type: "Full-time",
    description: "Automated test job posting created by test suite.",
    salary: "$80,000",
  };
  const createJobRes = await request("/api/jobs", {
    method: "POST",
    body: JSON.stringify(jobPayload),
  });
  const createdJob = await createJobRes.json();
  record(
    "POST /api/jobs (authenticated → 200)",
    createJobRes.ok && createdJob.id,
    createJobRes.status.toString(),
  );

  const jobId = createdJob.id;

  // --- List jobs API ---
  const listJobsRes = await request("/api/jobs");
  const allJobs = await listJobsRes.json();
  record(
    "GET /api/jobs",
    listJobsRes.ok && Array.isArray(allJobs) && allJobs.some((j) => j.id === jobId),
    `count ${allJobs.length}`,
  );

  // --- Job pages ---
  if (jobId) {
    const jobsPage = await request("/jobs");
    record("GET /jobs (with new job in DB)", jobsPage.status === 200);

    const jobDetail = await request(`/jobs/${jobId}`);
    record(`GET /jobs/${jobId}`, jobDetail.status === 200);

    // --- Apply to job ---
    const applyRes = await request(`/api/jobs/${jobId}/apply`, { method: "POST" });
    record("POST /api/jobs/:id/apply (first time → 200)", applyRes.ok, applyRes.status.toString());

    const applyAgain = await request(`/api/jobs/${jobId}/apply`, { method: "POST" });
    record("POST /api/jobs/:id/apply (duplicate → 400)", applyAgain.status === 400);

    // --- Apply without auth ---
    cookies = [];
    const applyGuest = await request(`/api/jobs/${jobId}/apply`, { method: "POST" });
    record("POST /api/jobs/:id/apply (guest → 401)", applyGuest.status === 401);
  } else {
    record("Job detail & apply tests", false, "skipped — job creation failed");
  }

  // --- Invalid sign-in ---
  cookies = [];
  const badSignIn = await signInWithCredentials(testEmail, "wrongpassword");
  record(
    "POST credentials sign-in (wrong password)",
    badSignIn.status !== 200 || badSignIn.url?.includes("error"),
    `status ${badSignIn.status}`,
  );

  // --- Job validation ---
  await signInWithCredentials(testEmail, testPassword);
  const badJob = await request("/api/jobs", {
    method: "POST",
    body: JSON.stringify({ title: "AB", company: "X" }),
  });
  record("POST /api/jobs (invalid payload → 400)", badJob.status === 400);

  // --- 404 job ---
  const notFoundJob = await request("/jobs/nonexistent-id-000");
  record("GET /jobs/invalid-id", notFoundJob.status === 404, `status ${notFoundJob.status}`);

  printSummary();
  process.exit(results.every((r) => r.passed) ? 0 : 1);
}

function printSummary() {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed, ${results.length} total`);
  if (failed > 0) {
    console.log("\nFailed tests:");
    results.filter((r) => !r.passed).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
