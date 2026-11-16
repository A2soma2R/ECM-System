"use strict";

// ===== Page Elements =====
const protectedContent = document.getElementById("protectedContent");
const userName = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const pageMessage = document.getElementById("pageMessage");
const refreshDashboardButton = document.getElementById(
  "refreshDashboardButton"
);

const statisticsStatus = document.getElementById("statisticsStatus");
const usersStatus = document.getElementById("usersStatus");
const usersTableBody = document.getElementById("usersTableBody");

// ===== Statistics Elements =====
const statisticElements = {
  totalUsers: document.getElementById("totalUsers"),
  activeUsers: document.getElementById("activeUsers"),
  inactiveUsers: document.getElementById("inactiveUsers"),
  totalFiles: document.getElementById("totalFiles"),
  totalFolders: document.getElementById("totalFolders"),
};

const totalStorage = document.getElementById("totalStorage");

// ===== Dialog Elements =====
const statusDialog = document.getElementById("statusDialog");
const statusDialogForm = document.getElementById("statusDialogForm");
const statusDialogTitle = document.getElementById("statusDialogTitle");
const statusDialogDescription = document.getElementById(
  "statusDialogDescription"
);
const statusDialogError = document.getElementById("statusDialogError");
const cancelStatusButton = document.getElementById("cancelStatusButton");
const confirmStatusButton = document.getElementById("confirmStatusButton");

// ===== Page State =====
let token = "";
let currentUser = null;
let selectedUser = null;
let loading = false;
let updating = false;
let redirecting = false;

// ===== Page Messages =====
const showMessage = (message, type = "error") => {
  pageMessage.textContent = message;
  pageMessage.className = `form-message ${type}`;
  pageMessage.hidden = false;
};

const showDialogError = (message) => {
  statusDialogError.textContent = message;
  statusDialogError.hidden = false;
};

// ===== Sign Out =====
const signOut = () => {
  if (redirecting) return;

  redirecting = true;
  protectedContent.hidden = true;

  if (statusDialog.open) {
    statusDialog.close();
  }

  try {
    sessionStorage.removeItem("ecmToken");
    sessionStorage.removeItem("ecmUser");
  } finally {
    window.location.replace("/login.html");
  }
};

// ===== API Requests =====
const requestJSON = async (url, options = {}) => {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Unable to connect. Check your connection and try again."
    );
  }

  if (response.status === 401) {
    signOut();
    throw new Error("Please sign in again.");
  }

  if (response.status === 403) {
    protectedContent.hidden = true;

    if (statusDialog.open) {
      statusDialog.close();
    }

    redirecting = true;
    window.location.replace("/files.html");
    throw new Error("Admin access is unavailable.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to complete this action. Please try again."
    );
  }

  return data;
};

// ===== File Size Formatting =====
const formatStorage = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// ===== Load Statistics =====
const loadStatistics = async () => {
  statisticsStatus.textContent = "Loading statistics...";

  try {
    const data = await requestJSON("/api/admin/dashboard");

    if (!data.statistics) {
      throw new Error("The statistics response is incomplete.");
    }

    Object.entries(statisticElements).forEach(([key, element]) => {
      element.textContent = String(data.statistics[key] ?? 0);
    });

    totalStorage.textContent = formatStorage(
      data.statistics.totalBytes || 0
    );

    statisticsStatus.textContent = "Statistics updated.";
  } catch (error) {
    Object.values(statisticElements).forEach((element) => {
      element.textContent = "—";
    });

    totalStorage.textContent = "—";
    statisticsStatus.textContent = "Unable to load statistics.";
    throw error;
  }
};

// ===== Table Cell Helper =====
const appendCell = (row, text) => {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.append(cell);
  return cell;
};

// ===== Render Users =====
const renderUsers = (users) => {
  usersTableBody.replaceChildren();

  users.forEach((user) => {
    const row = document.createElement("tr");

    appendCell(row, user.name);
    appendCell(row, user.email);
    appendCell(row, user.role === "admin" ? "Admin" : "Employee");

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.className = `account-status ${
      user.isActive ? "active" : "inactive"
    }`;
    badge.textContent = user.isActive ? "Active" : "Inactive";

    statusCell.append(badge);
    row.append(statusCell);

    const actionCell = document.createElement("td");
    const currentUserId = currentUser._id || currentUser.id;

    if (user.role === "employee" && user._id !== currentUserId) {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = user.isActive ? "Deactivate" : "Activate";
      button.className = user.isActive ? "danger-button" : "";
      button.disabled = loading || updating;
      button.setAttribute(
        "aria-label",
        `${user.isActive ? "Deactivate" : "Activate"} ${user.name}`
      );

      button.addEventListener("click", () => {
        openStatusDialog(user);
      });

      actionCell.append(button);
    } else {
      const note = document.createElement("span");
      note.className = "account-note";
      note.textContent =
        user._id === currentUserId ? "Your account" : "Admin account";

      actionCell.append(note);
    }

    row.append(actionCell);
    usersTableBody.append(row);
  });
};

// ===== Load Users =====
const loadUsers = async () => {
  usersStatus.textContent = "Loading users...";

  try {
    const data = await requestJSON("/api/admin/users");

    if (!Array.isArray(data.users)) {
      throw new Error("The users response is incomplete.");
    }

    renderUsers(data.users);

    usersStatus.textContent = data.users.length
      ? `${data.users.length} user(s) found.`
      : "No users found.";
  } catch (error) {
    usersTableBody.replaceChildren();
    usersStatus.textContent = "Unable to load users.";
    throw error;
  }
};

// ===== Page Loading State =====
const updatePageControls = () => {
  const busy = loading || updating;

  refreshDashboardButton.disabled = busy;

  usersTableBody.querySelectorAll("button").forEach((button) => {
    button.disabled = busy;
  });
};

// ===== Refresh Dashboard Data =====
const loadDashboard = async () => {
  loading = true;
  updatePageControls();

  try {
    const results = await Promise.allSettled([
      loadStatistics(),
      loadUsers(),
    ]);

    const errors = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason.message);

    if (errors.length && !redirecting) {
      showMessage([...new Set(errors)].join(" "));
    }
  } finally {
    loading = false;
    updatePageControls();
  }
};

// ===== Open Account Status Dialog =====
const openStatusDialog = (user) => {
  if (loading || updating || redirecting) return;

  selectedUser = user;
  statusDialogError.hidden = true;

  statusDialogTitle.textContent = user.isActive
    ? "Deactivate account"
    : "Activate account";

  statusDialogDescription.textContent = user.isActive
    ? `Deactivate the account for ${user.name} (${user.email})? This user will lose access to the system. Their files and folders will be kept.`
    : `Activate the account for ${user.name} (${user.email})? This user will be able to sign in again.`;

  confirmStatusButton.textContent = user.isActive
    ? "Deactivate"
    : "Activate";

  confirmStatusButton.className = user.isActive ? "danger-button" : "";

  statusDialog.showModal();
  cancelStatusButton.focus();
};

// ===== Dialog Loading State =====
const setUpdating = (busy) => {
  updating = busy;
  cancelStatusButton.disabled = busy;
  confirmStatusButton.disabled = busy;
  statusDialogForm.setAttribute("aria-busy", String(busy));
  updatePageControls();
};

// ===== Update Account Status =====
statusDialogForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedUser || updating || redirecting) return;

  const user = selectedUser;
  const nextStatus = !user.isActive;

  statusDialogError.hidden = true;
  setUpdating(true);

  try {
    const data = await requestJSON(
      `/api/admin/users/${user._id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: nextStatus,
        }),
      }
    );

    statusDialog.close();

    showMessage(
      data.message || "Account status updated successfully.",
      "success"
    );

    await loadDashboard();
  } catch (error) {
    if (!redirecting) {
      if (statusDialog.open) {
        showDialogError(error.message);
      } else {
        showMessage(error.message);
      }
    }
  } finally {
    setUpdating(false);
  }
});

// ===== Dialog Closing Events =====
cancelStatusButton.addEventListener("click", () => {
  if (!updating) statusDialog.close();
});

statusDialog.addEventListener("cancel", (event) => {
  if (updating) event.preventDefault();
});

statusDialog.addEventListener("close", () => {
  selectedUser = null;
});

// ===== Refresh Event =====
refreshDashboardButton.addEventListener("click", async () => {
  if (loading || updating || redirecting) return;

  pageMessage.hidden = true;
  await loadDashboard();
});

// ===== Logout Event =====
logoutButton.addEventListener("click", signOut);

// ===== Page Initialization =====
const initializePage = async () => {
  refreshDashboardButton.disabled = true;

  try {
    token = sessionStorage.getItem("ecmToken");

    if (!token) {
      signOut();
      return;
    }

    const data = await requestJSON("/api/auth/profile");

    if (!data.user) {
      throw new Error("Unable to load your account information.");
    }

    if (data.user.role !== "admin") {
      redirecting = true;
      window.location.replace("/files.html");
      return;
    }

    currentUser = data.user;
    userName.textContent = currentUser.name;
    protectedContent.hidden = false;

    await loadDashboard();
  } catch (error) {
    if (redirecting) return;

    protectedContent.hidden = false;
    showMessage(error.message);
    statisticsStatus.textContent = "Unable to load dashboard.";
    usersStatus.textContent = "Reload the page to try again.";
  }
};

// ===== Page Startup =====
initializePage();