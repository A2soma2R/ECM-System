"use strict";

// ===== Page Elements =====
const protectedContent = document.getElementById("protectedContent");
const userName = document.getElementById("userName");
const adminDashboardLink = document.getElementById("adminDashboardLink");
const logoutButton = document.getElementById("logoutButton");
const pageMessage = document.getElementById("pageMessage");

const createFolderForm = document.getElementById("createFolderForm");
const folderName = document.getElementById("folderName");
const foldersList = document.getElementById("foldersList");

const uploadFileForm = document.getElementById("uploadFileForm");
const uploadFolder = document.getElementById("uploadFolder");
const uploadCategory = document.getElementById("uploadCategory");
const uploadFileInput = document.getElementById("uploadFile");
const chooseFileButton = document.getElementById("chooseFileButton");
const selectedFileName = document.getElementById("selectedFileName");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchScope = document.getElementById("searchScope");
const categoryFilter = document.getElementById("categoryFilter");
const folderFilter = document.getElementById("folderFilter");
const clearSearchButton = document.getElementById("clearSearchButton");
const filesStatus = document.getElementById("filesStatus");
const filesTableBody = document.getElementById("filesTableBody");

const refreshSharedButton = document.getElementById("refreshSharedButton");
const sharedFilesStatus = document.getElementById("sharedFilesStatus");
const sharedFilesTableBody = document.getElementById("sharedFilesTableBody");

// ===== Action Dialog Elements =====
const actionDialog = document.getElementById("actionDialog");
const dialogForm = document.getElementById("dialogForm");
const dialogTitle = document.getElementById("dialogTitle");
const dialogDescription = document.getElementById("dialogDescription");
const dialogInputGroup = document.getElementById("dialogInputGroup");
const dialogInputLabel = document.getElementById("dialogInputLabel");
const dialogInput = document.getElementById("dialogInput");
const dialogError = document.getElementById("dialogError");
const dialogCancelButton = document.getElementById("dialogCancelButton");
const dialogConfirmButton = document.getElementById("dialogConfirmButton");

// ===== Sharing Dialog Elements =====
const sharingDialog = document.getElementById("sharingDialog");
const sharingFileName = document.getElementById("sharingFileName");
const sharingMessage = document.getElementById("sharingMessage");
const shareFileForm = document.getElementById("shareFileForm");
const shareEmail = document.getElementById("shareEmail");
const sharePermission = document.getElementById("sharePermission");
const saveShareButton = document.getElementById("saveShareButton");
const sharesStatus = document.getElementById("sharesStatus");
const sharesList = document.getElementById("sharesList");
const closeSharingButton = document.getElementById("closeSharingButton");

// ===== Page State =====
let token = "";
let actionRunning = false;
let sharingBusy = false;
let redirecting = false;
let currentSharingFile = null;
let filesRequestNumber = 0;
let sharedRequestNumber = 0;
let sharingRequestNumber = 0;

// ===== Messages =====
const displayMessage = (element, message, type = "error") => {
  element.textContent = message;
  element.className = `form-message ${type}`;
  element.hidden = false;
};

const showMessage = (message, type = "error") => {
  displayMessage(pageMessage, message, type);
};

// ===== Sign Out =====
const signOut = () => {
  if (redirecting) return;

  redirecting = true;
  protectedContent.hidden = true;

  if (actionDialog.open) actionDialog.close();
  if (sharingDialog.open) sharingDialog.close();

  try {
    sessionStorage.removeItem("ecmToken");
    sessionStorage.removeItem("ecmUser");
  } finally {
    window.location.replace("/login.html");
  }
};

// ===== API Requests =====
const apiRequest = async (url, options = {}) => {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  let response;

  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new Error("Unable to connect. Check your connection and try again.");
  }

  if (response.status === 401 || response.status === 403) {
    signOut();
    throw new Error("Your session is unavailable. Please sign in again.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Unable to complete this action. Please try again."
    );
  }

  return response;
};

const requestJSON = async (url, options = {}) => {
  const response = await apiRequest(url, options);
  return response.json();
};

const jsonOptions = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// ===== Run Page Actions =====
const runAction = async (button, action) => {
  if (actionRunning || redirecting) return;

  actionRunning = true;
  button.disabled = true;
  pageMessage.hidden = true;

  try {
    await action();
  } catch (error) {
    if (!redirecting) showMessage(error.message);
  } finally {
    button.disabled = false;
    actionRunning = false;
  }
};

// ===== Action Buttons =====
const createActionButton = (text, className, action) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;

  button.addEventListener("click", () => {
    runAction(button, action);
  });

  return button;
};

// ===== Action Dialog =====
const openActionDialog = ({
  title,
  description,
  inputLabel = "",
  value = "",
  confirmText = "Save",
  destructive = false,
}) => {
  return new Promise((resolve) => {
    let result = null;

    dialogTitle.textContent = title;
    dialogDescription.textContent = description;
    dialogInputLabel.textContent = inputLabel;
    dialogInput.value = value;
    dialogInputGroup.hidden = !inputLabel;
    dialogInput.disabled = !inputLabel;
    dialogInput.removeAttribute("aria-invalid");
    dialogError.hidden = true;

    dialogConfirmButton.textContent = confirmText;
    dialogConfirmButton.className = destructive ? "danger-button" : "";

    const handleSubmit = (event) => {
      event.preventDefault();

      if (inputLabel && !dialogInput.value.trim()) {
        displayMessage(dialogError, `${inputLabel} cannot be empty.`);
        dialogInput.setAttribute("aria-invalid", "true");
        dialogInput.focus();
        return;
      }

      result = inputLabel ? dialogInput.value.trim() : true;
      actionDialog.close();
    };

    const handleCancel = () => actionDialog.close();

    const handleInput = () => {
      dialogError.hidden = true;
      dialogInput.removeAttribute("aria-invalid");
    };

    const handleClose = () => {
      dialogForm.removeEventListener("submit", handleSubmit);
      dialogCancelButton.removeEventListener("click", handleCancel);
      dialogInput.removeEventListener("input", handleInput);
      resolve(result);
    };

    dialogForm.addEventListener("submit", handleSubmit);
    dialogCancelButton.addEventListener("click", handleCancel);
    dialogInput.addEventListener("input", handleInput);
    actionDialog.addEventListener("close", handleClose, { once: true });

    actionDialog.showModal();

    if (inputLabel) {
      dialogInput.focus();
      dialogInput.select();
    } else {
      dialogCancelButton.focus();
    }
  });
};

// ===== File Picker =====
const updateSelectedFileName = () => {
  selectedFileName.textContent =
    uploadFileInput.files[0]?.name || "No file selected";
};

chooseFileButton.addEventListener("click", () => {
  uploadFileInput.click();
});

uploadFileInput.addEventListener("change", updateSelectedFileName);

// ===== Folder Select Options =====
const updateFolderSelect = (select, folders, placeholder) => {
  const previousValue = select.value;
  select.replaceChildren(new Option(placeholder, ""));

  folders.forEach((folder) => {
    select.add(new Option(folder.name, folder._id));
  });

  if (folders.some((folder) => folder._id === previousValue)) {
    select.value = previousValue;
  }
};

// ===== Load Folders =====
const loadFolders = async () => {
  const data = await requestJSON("/api/folders");
  const folders = data.folders || [];

  foldersList.replaceChildren();

  updateFolderSelect(uploadFolder, folders, "Select a folder");
  updateFolderSelect(folderFilter, folders, "All folders");

  if (!folders.length) {
    const item = document.createElement("li");
    item.textContent = "No folders yet. Create your first folder.";
    foldersList.append(item);
    return;
  }

  folders.forEach((folder) => {
    const item = document.createElement("li");
    item.className = "folder-item";

    const name = document.createElement("span");
    name.className = "folder-name";
    name.textContent = folder.name;

    const actions = document.createElement("div");
    actions.className = "folder-actions";

    actions.append(
      createActionButton("Rename", "secondary-button", () =>
        renameFolder(folder)
      ),
      createActionButton("Delete", "danger-button", () =>
        deleteFolder(folder)
      )
    );

    item.append(name, actions);
    foldersList.append(item);
  });
};

// ===== Rename Folder =====
const renameFolder = async (folder) => {
  const name = await openActionDialog({
    title: "Rename folder",
    description: "Enter a new name for this folder.",
    inputLabel: "Folder name",
    value: folder.name,
  });

  if (name === null) return;

  await requestJSON(
    `/api/folders/${folder._id}`,
    jsonOptions("PATCH", { name })
  );

  showMessage("Folder renamed successfully.", "success");
  await refreshOwnedLists();
};

// ===== Delete Folder =====
const deleteFolder = async (folder) => {
  const confirmed = await openActionDialog({
    title: "Delete folder",
    description: `Delete "${folder.name}"? The folder must be empty.`,
    confirmText: "Delete",
    destructive: true,
  });

  if (!confirmed) return;

  await requestJSON(`/api/folders/${folder._id}`, { method: "DELETE" });

  showMessage("Folder deleted successfully.", "success");
  await refreshOwnedLists();
};

// ===== File Size =====
const formatSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// ===== Table Helpers =====
const appendCell = (row, text) => {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.append(cell);
  return cell;
};

const createPermissionBadge = (permission) => {
  const badge = document.createElement("span");
  badge.className = "permission-badge";
  badge.textContent = permission === "edit" ? "Edit category" : "View";
  return badge;
};

// ===== Render My Files =====
const renderFiles = (files) => {
  filesTableBody.replaceChildren();

  files.forEach((file) => {
    const row = document.createElement("tr");

    const nameCell = appendCell(row, file.originalName);
    const contentStatus = document.createElement("small");
    contentStatus.className = "content-status";
    const contentLabels = {
      indexed: "Content searchable",
      truncated: "Content searchable: first 500,000 characters",
      empty: "No extractable text: search by name",
      unsupported: "Content search not supported for this format",
      failed: "Content indexing failed: search by name",
      pending: "Content not indexed yet",
    };
    contentStatus.textContent = contentLabels[file.contentIndexStatus] || contentLabels.pending;
    nameCell.append(contentStatus);
    appendCell(row, file.folder?.name || "Unavailable folder");
    appendCell(row, file.category || "General");
    appendCell(row, formatSize(file.size));

    const cell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "file-actions";

    actions.append(
      createActionButton("Download", "secondary-button", () =>
        downloadFile(file)
      ),
      createActionButton("Category", "secondary-button", () =>
        updateCategory(file)
      ),
      createActionButton("Share", "secondary-button", () =>
        openSharingDialog(file)
      ),
      createActionButton("Delete", "danger-button", () =>
        deleteFile(file)
      )
    );

    cell.append(actions);
    row.append(cell);
    filesTableBody.append(row);
  });
};

// ===== Load My Files =====
const loadFiles = async () => {
  const requestNumber = ++filesRequestNumber;
  const params = new URLSearchParams();

  if (searchInput.value.trim()) {
    params.set("search", searchInput.value.trim());
    params.set("scope", searchScope.value);
  }

  if (categoryFilter.value.trim()) {
    params.set("category", categoryFilter.value.trim());
  }

  if (folderFilter.value) {
    params.set("folderId", folderFilter.value);
  }

  filesStatus.textContent = "Loading files...";
  filesTableBody.replaceChildren();

  try {
    const query = params.toString();
    const url = query ? `/api/files/search?${query}` : "/api/files";
    const data = await requestJSON(url);

    if (requestNumber !== filesRequestNumber) return;

    const files = data.files || [];
    renderFiles(files);

    filesStatus.textContent = files.length
      ? `${files.length} file(s) found.`
      : "No files found.";
  } catch (error) {
    if (requestNumber === filesRequestNumber) {
      filesStatus.textContent = "Unable to load files.";
    }

    throw error;
  }
};

// ===== Refresh My Files and Folders =====
const refreshOwnedLists = async () => {
  try {
    await loadFolders();
    await loadFiles();
  } catch (error) {
    if (!redirecting) {
      showMessage(
        `The action was saved, but the lists could not refresh. ${error.message}`
      );
    }
  }
};

// ===== Render Shared Files =====
const renderSharedFiles = (files) => {
  sharedFilesTableBody.replaceChildren();

  files.forEach((file) => {
    const row = document.createElement("tr");
    appendCell(row, file.originalName);

    const ownerCell = document.createElement("td");
    const name = document.createElement("span");
    name.className = "owner-name";
    name.textContent = file.owner?.name || "Unavailable user";

    const email = document.createElement("span");
    email.className = "owner-email";
    email.textContent = file.owner?.email || "";

    ownerCell.append(name, email);
    row.append(ownerCell);

    appendCell(row, file.category || "General");
    appendCell(row, formatSize(file.size));

    const permissionCell = document.createElement("td");
    permissionCell.append(createPermissionBadge(file.permission));
    row.append(permissionCell);

    const actionCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "file-actions";

    actions.append(
      createActionButton("Download", "secondary-button", () =>
        downloadFile(file)
      )
    );

    if (file.permission === "edit") {
      actions.append(
        createActionButton("Category", "secondary-button", () =>
          updateCategory(file, true)
        )
      );
    }

    actionCell.append(actions);
    row.append(actionCell);
    sharedFilesTableBody.append(row);
  });
};

// ===== Load Shared Files =====
const loadSharedFiles = async () => {
  const requestNumber = ++sharedRequestNumber;

  sharedFilesStatus.textContent = "Loading shared files...";
  sharedFilesTableBody.replaceChildren();

  try {
    const data = await requestJSON("/api/files/shared");

    if (requestNumber !== sharedRequestNumber) return;

    const files = data.files || [];
    renderSharedFiles(files);

    sharedFilesStatus.textContent = files.length
      ? `${files.length} shared file(s) found.`
      : "No files have been shared with you.";
  } catch (error) {
    if (requestNumber === sharedRequestNumber) {
      sharedFilesStatus.textContent = "Unable to load shared files.";
    }

    throw error;
  }
};

// ===== Download File =====
const downloadFile = async (file) => {
  const response = await apiRequest(`/api/files/${file._id}/download`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.originalName;
  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showMessage("File download started.", "success");
};

// ===== Update File Category =====
const updateCategory = async (file, shared = false) => {
  const category = await openActionDialog({
    title: "Update category",
    description: "Enter a category for this file.",
    inputLabel: "Category",
    value: file.category || "General",
  });

  if (category === null) return;

  await requestJSON(
    `/api/files/${file._id}`,
    jsonOptions("PATCH", { category })
  );

  showMessage("Category updated successfully.", "success");

  if (shared) {
    await loadSharedFiles();
  } else {
    await loadFiles();
  }
};

// ===== Delete File =====
const deleteFile = async (file) => {
  const confirmed = await openActionDialog({
    title: "Delete file",
    description: `Permanently delete "${file.originalName}"?`,
    confirmText: "Delete",
    destructive: true,
  });

  if (!confirmed) return;

  await requestJSON(`/api/files/${file._id}`, { method: "DELETE" });

  showMessage("File deleted successfully.", "success");
  await refreshOwnedLists();
};

// ===== Sharing Loading State =====
const setSharingBusy = (busy) => {
  sharingBusy = busy;
  shareEmail.disabled = busy;
  sharePermission.disabled = busy;
  saveShareButton.disabled = busy;
  closeSharingButton.disabled = busy;
  shareFileForm.setAttribute("aria-busy", String(busy));

  sharesList.querySelectorAll("button").forEach((button) => {
    button.disabled = busy;
  });
};

// ===== Run Sharing Actions =====
const runSharingAction = async (action) => {
  if (sharingBusy || redirecting || !currentSharingFile) return;

  setSharingBusy(true);
  sharingMessage.hidden = true;

  try {
    await action();
  } catch (error) {
    if (!redirecting && sharingDialog.open) {
      displayMessage(sharingMessage, error.message);
    }
  } finally {
    setSharingBusy(false);
  }
};

// ===== Sharing List Buttons =====
const createShareButton = (text, className, action) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", action);
  return button;
};

// ===== Render Current Shares =====
const renderShares = (shares) => {
  sharesList.replaceChildren();

  shares.forEach((share) => {
    const item = document.createElement("li");
    item.className = "share-item";

    const details = document.createElement("div");
    details.className = "share-user";

    const name = document.createElement("span");
    name.className = "share-user-name";
    name.textContent = share.user.name;

    const email = document.createElement("span");
    email.className = "share-user-email";
    email.textContent = share.user.email;

    details.append(name, email, createPermissionBadge(share.permission));

    const actions = document.createElement("div");
    actions.className = "share-actions";

    actions.append(
      createShareButton("Edit", "secondary-button", () => {
        if (sharingBusy) return;

        shareEmail.value = share.user.email;
        sharePermission.value = share.permission;
        sharingMessage.hidden = true;
        sharePermission.focus();
      }),
      createShareButton("Remove", "danger-button", () => {
        runSharingAction(async () => {
          const fileId = currentSharingFile._id;

          await requestJSON(
            `/api/files/${fileId}/shares/${share.user.id}`,
            { method: "DELETE" }
          );

          shareFileForm.reset();

          displayMessage(
            sharingMessage,
            "File sharing removed successfully.",
            "success"
          );

          await loadShares(fileId);
        });
      })
    );

    item.append(details, actions);
    sharesList.append(item);
  });
};

// ===== Load Current Shares =====
const loadShares = async (fileId) => {
  const requestNumber = ++sharingRequestNumber;

  sharesStatus.textContent = "Loading sharing list...";
  sharesList.replaceChildren();

  try {
    const data = await requestJSON(`/api/files/${fileId}/shares`);

    if (
      requestNumber !== sharingRequestNumber ||
      currentSharingFile?._id !== fileId ||
      !sharingDialog.open
    ) {
      return;
    }

    const shares = data.shares || [];
    renderShares(shares);

    sharesStatus.textContent = shares.length
      ? `${shares.length} user(s) have access.`
      : "This file has not been shared.";

    if (sharingBusy) setSharingBusy(true);
  } catch (error) {
    if (requestNumber === sharingRequestNumber) {
      sharesStatus.textContent = "Unable to load the sharing list.";
    }

    throw error;
  }
};

// ===== Open Sharing Dialog =====
const openSharingDialog = async (file) => {
  currentSharingFile = file;
  sharingFileName.textContent = file.originalName;
  sharingMessage.hidden = true;
  shareFileForm.reset();
  sharesList.replaceChildren();
  setSharingBusy(true);
  sharingDialog.showModal();

  try {
    await loadShares(file._id);
  } catch (error) {
    if (!redirecting && sharingDialog.open) {
      displayMessage(sharingMessage, error.message);
    }
  } finally {
    setSharingBusy(false);

    if (sharingDialog.open) shareEmail.focus();
  }
};

// ===== Close Sharing Dialog =====
closeSharingButton.addEventListener("click", () => {
  if (!sharingBusy) sharingDialog.close();
});

sharingDialog.addEventListener("cancel", (event) => {
  if (sharingBusy) event.preventDefault();
});

sharingDialog.addEventListener("close", () => {
  currentSharingFile = null;
  sharingRequestNumber++;
});

// ===== Save File Sharing =====
shareFileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  runSharingAction(async () => {
    const email = shareEmail.value.trim();

    if (!email) {
      displayMessage(sharingMessage, "Enter the user's email address.");
      return;
    }

    if (shareEmail.validity.typeMismatch) {
      displayMessage(sharingMessage, "Enter a valid email address.");
      return;
    }

    const fileId = currentSharingFile._id;

    await requestJSON(
      `/api/files/${fileId}/shares`,
      jsonOptions("PUT", {
        email,
        permission: sharePermission.value,
      })
    );

    shareFileForm.reset();

    displayMessage(
      sharingMessage,
      "File sharing saved successfully.",
      "success"
    );

    await loadShares(fileId);
  });
});

// ===== Create Folder =====
createFolderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  runAction(document.getElementById("createFolderButton"), async () => {
    const name = folderName.value.trim();

    if (!name) {
      showMessage("Enter a folder name.");
      folderName.focus();
      return;
    }

    await requestJSON("/api/folders", jsonOptions("POST", { name }));

    createFolderForm.reset();
    showMessage("Folder created successfully.", "success");
    await refreshOwnedLists();
  });
});

// ===== Upload File =====
uploadFileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  runAction(document.getElementById("uploadFileButton"), async () => {
    if (!uploadFolder.value) {
      showMessage("Select a folder.");
      uploadFolder.focus();
      return;
    }

    const file = uploadFileInput.files[0];

    if (!file) {
      showMessage("Choose a file to upload.");
      chooseFileButton.focus();
      return;
    }

    const allowedTypes = [
      "pdf", "docx", "xlsx", "pptx", "txt", "png", "jpg", "jpeg",
    ];

    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(extension)) {
      showMessage("Choose a supported document or image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage("File size must not exceed 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("folderId", uploadFolder.value);
    formData.append("category", uploadCategory.value.trim() || "General");
    formData.append("file", file);

    await requestJSON("/api/files", {
      method: "POST",
      body: formData,
    });

    uploadFileInput.value = "";
    updateSelectedFileName();

    showMessage("File uploaded successfully.", "success");
    await refreshOwnedLists();
  });
});

// ===== Search Events =====
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  runAction(document.getElementById("searchButton"), loadFiles);
});

clearSearchButton.addEventListener("click", () => {
  runAction(clearSearchButton, async () => {
    searchForm.reset();
    await loadFiles();
  });
});

// ===== Shared Files Refresh =====
refreshSharedButton.addEventListener("click", () => {
  runAction(refreshSharedButton, loadSharedFiles);
});

// ===== Logout Event =====
logoutButton.addEventListener("click", signOut);

// ===== Page Initialization =====
const initializePage = async () => {
  try {
    token = sessionStorage.getItem("ecmToken");

    if (!token) {
      signOut();
      return;
    }

    const data = await requestJSON("/api/auth/profile");

    if (!data.user) {
      throw new Error("Unable to load your user information.");
    }

    userName.textContent = data.user.name;

    // ===== Admin Navigation =====
    if (adminDashboardLink) {
      adminDashboardLink.hidden = data.user.role !== "admin";
    }

    protectedContent.hidden = false;

    await loadFolders();
    await loadFiles();

    try {
      await loadSharedFiles();
    } catch (error) {
      if (!redirecting) showMessage(error.message);
    }
  } catch (error) {
    if (redirecting) return;

    protectedContent.hidden = false;

    showMessage(
      `Unable to load the page. Reload to try again. ${error.message}`
    );
  }
};

// ===== Page Startup =====
updateSelectedFileName();
initializePage();