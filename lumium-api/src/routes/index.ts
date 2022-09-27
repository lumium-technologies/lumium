export { pub as v1pub } from './v1';
export { sec as v1sec } from './v1';

/**
 * A User
 * @typedef {object} User
 * @property {string} id - The uuid
 * @property {string} firstName - The first name
 * @property {string} lastName - The last name
 * @property {string} nickName - The nick/user name
 * @property {string} birthday - The date of birth - string
 * @property {array<Email>} emails - Emails associated with the user
 * @property {array<Address>} addresses - Addresses associated with the user
 * @property {array<Workspace>} ownedWorkspaces - Workspaces owned by the user
 * @property {array<Workspace>} administratedWorkspaces - Workspaces administrated by the user
 * @property {array<Workspace>} memberWorkspaces - Workspaces of which the user is a member
 * @property {array<Workspace>} visitorWorkspaces - Workspaces of which the user is a visitors
 * @property {array<Page>} ownedPages - Pages owned by the user
 * @property {array<Page>} administratedPages - Pages administrated by the user
 * @property {array<Page>} memberPages - Pages of which the user is a member
 * @property {array<Page>} visitorPages - Pages of which the user is a visitors
 * @property {array<UserPreference>} preferences - Preferences of the user
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A UserPreference
 * @typedef {object} UserPreference
 * @property {string} id - The uuid
 * @property {string} userId - The user associated with this preference
 * @property {string} option - enum:color_mode - The user preference option
 * @property {string} value - The value of the preference option
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * An Email
 * @typedef {object} Email
 * @property {string} id - The uuid
 * @property {string} userId - The user uuid associated with this email
 * @property {string} email - The actual email address
 * @property {boolean} primary - Flags whether the email is the primary email address on the user's account
 * @property {boolean} verified - Flags whether the email has been verified
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * An Address
 * @typedef {object} Address
 * @property {string} id - The uuid
 * @property {string} userId - The user uuid associated with this address
 * @property {string} kind - enum:residential,billing  - The kind of address
 * @property {string} fullName - Full name on the address
 * @property {string} lineOne - Address line one
 * @property {string} lineTwo - Address line two
 * @property {string} city - City of the address
 * @property {string} state - State of the address
 * @property {string} postalCode - Postal code of the address
 * @property {string} country - Country of the address
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A WorkspacePreference
 * @typedef {object} WorkspacePreference
 * @property {string} id - The uuid
 * @property {string} workspaceId - The workspace associated with this preference
 * @property {string} option - enum: - The workspace preference option
 * @property {string} value - The value of the preference option
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A Workspace
 * @typedef {object} Workspace
 * @property {string} id - The uuid
 * @property {string} ownerId - The user uuid that owns this workspace
 * @property {array<User>} admins - The administrators of this workspace
 * @property {array<User>} members - The members of this workspace
 * @property {array<User>} visitors - The visitors of this workspace
 * @property {array<Page>} pages - The pages of this workspace
 * @property {array<WorkspacePreference>} preferences - The preferences of this workspace
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A ContentElement
 * @typedef {object} ContentElement
 * @property {string} id - The uuid
 * @property {string} content - The actual content of the content element
 * @property {array<PageContent>} pageContents - The page contents with this content
 * @property {string} type - enum:markdown - The type of the content element
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A PageContent
 * @typedef {object} PageContent
 * @property {string} id - The uuid
 * @property {string} pageId - The page uuid this content belongs to
 * @property {number} position - The position on th page this content should be in
 * @property {ContentElement} contentElement - The actual content element at this position
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * A Page
 * @typedef {object} Page
 * @property {string} id - The uuid
 * @property {string} workspaceId - The workspace uuid that this page belongs to
 * @property {string} ownerId - The user uuid that owns this page
 * @property {array<User>} admins - The administrators of this page
 * @property {array<User>} members - The members of this page
 * @property {array<User>} visitors - The visitors of this page
 * @property {array<PageContent>} contents - The contents of this page
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */
