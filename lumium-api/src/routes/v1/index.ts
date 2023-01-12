export { pub } from './public';
export { sec } from './secure';

/**
 * @typedef {object} UserDTO
 * @property {string} id - The uuid
 * @property {string} firstName - The first name
 * @property {string} lastName - The last name
 * @property {string} nickName - The nick/user name
 * @property {string} birthday - The date of birth - string
 * @property {array<EmailDTO>} emails - Emails associated with the user
 * @property {array<AddressDTO>} addresses - Addresses associated with the user
 * @property {array<WorkspaceDTO>} ownedWorkspaces - Workspaces owned by the user
 * @property {array<WorkspaceDTO>} administratedWorkspaces - Workspaces administrated by the user
 * @property {array<WorkspaceDTO>} memberWorkspaces - Workspaces of which the user is a member
 * @property {array<WorkspaceDTO>} visitorWorkspaces - Workspaces of which the user is a visitors
 * @property {array<PageDTO>} ownedPages - Pages owned by the user
 * @property {array<PageDTO>} administratedPages - Pages administrated by the user
 * @property {array<PageDTO>} memberPages - Pages of which the user is a member
 * @property {array<PageDTO>} visitorPages - Pages of which the user is a visitors
 * @property {array<UserPreferenceDTO>} preferences - Preferences of the user
 * @property {WorkspaceDTO} recentWorkspace - Most recently accessed workspace
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} UserPreferenceDTO
 * @property {string} id - The uuid
 * @property {UserDTO} user - The user associated with this preference
 * @property {string} option - enum:color_mode - The user preference option
 * @property {string} value - The value of the preference option
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} EmailDTO
 * @property {string} id - The uuid
 * @property {UserDTO} user - The user associated with this email
 * @property {string} email - The actual email address
 * @property {boolean} primary - Flags whether the email is the primary email address on the user's account
 * @property {boolean} verified - Flags whether the email has been verified
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} AddressDTO
 * @property {string} id - The uuid
 * @property {UserDTO} user - The user associated with this address
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
 * @typedef {object} WorkspacePreferenceDTO
 * @property {string} id - The uuid
 * @property {WorkspaceDTO} workspace - The workspace associated with this preference
 * @property {string} option - enum: - The workspace preference option
 * @property {string} value - The value of the preference option
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} WorkspaceDTO
 * @property {string} id - The uuid
 * @property {UserDTO} owner - The user that owns this workspace
 * @property {array<UserDTO>} admins - The administrators of this workspace
 * @property {array<UserDTO>} members - The members of this workspace
 * @property {array<UserDTO>} visitors - The visitors of this workspace
 * @property {array<PageDTO>} pages - The pages of this workspace
 * @property {array<WorkspacePreferenceDTO>} preferences - The preferences of this workspace
 * @property {E2EKeyDTO} key - The end-to-end key associated with this workspace
 * @property {string} name - The name of the workspace
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} PageDTO
 * @property {string} id - The uuid
 * @property {WorkspaceDTO} workspace - The workspace that this page belongs to
 * @property {UserDTO} owner - The user that owns this page
 * @property {array<UserDTO>} admins - The administrators of this page
 * @property {array<UserDTO>} members - The members of this page
 * @property {array<UserDTO>} visitors - The visitors of this page
 * @property {string} content - The markdown content of this page
 * @property {string} name - The name of the page
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */

/**
 * @typedef {object} E2EKeyDTO
 * @property {string} id - The uuid
 * @property {WorkspaceDTO} workspace - The workspace associated with this key
 * @property {array<E2EKeyVariantDTO>} keys - The key variants to associate with this key
 * @property {string} activator - A plain-text string to match against decrypted values of key variants in order to be able to figure out which key is decryptable with the user-provided password
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 *
 */

/**
 * @typedef {object} E2EKeyVariantDTO
 * @property {string} id - The uuid
 * @property {string} activator - The encrypted activator string of the key
 * @property {string} activatorNonce - The nonce with which the activator string was encrypted
 * @property {string} value - The encrypted value string of the key
 * @property {string} valueNonce - The nonce with which the value string was encrypted
 * @property {boolean} active - Signifies whether the variant is still active
 * @property {string} createdAt - The object creation timestamp
 * @property {string} updatedAt - The object update timestamp
 * @property {string} deletedAt - The object delete timestamp
 * @property {number} version - The object version number
 */


/**
 * @typedef {object} E2EKeyCreateDTO
 * @property {array<E2EKeyVariantCreateDTO>} keys - The key variants to associate with this key
 * @property {string} activator - A plain-text string to match against decrypted values of key variants in order to be able to figure out which key is decryptable with the user-provided password
 *
 */

/**
 * @typedef {object} E2EKeyVariantCreateDTO
 * @property {string} activator - The encrypted activator string of the key
 * @property {string} activatorNonce - The nonce with which the activator string was encrypted
 * @property {string} value - The encrypted value string of the key
 * @property {string} valueNonce - The nonce with which the value string was encrypted
 */

/**
 * @typedef {object} WorkspaceCreateDTO
 * @property {E2EKeyCreateDTO} key - The e2e key associated with this workspace
 * @property {string} name - The name of the workspace
 */

/**
 * @typedef {object} WorkspaceUpdateDTO
 * @property {string} ownerId - The new owner uuid
 * @property {array<string>} admins - The new admin uuids
 * @property {array<string>} members - The new member uuids
 * @property {array<string>} visitors - The new visitor uuids
 * @property {array<PageDTO>} pages - The new pages
 * @property {array<WorkspacePreferenceDTO>} preferences - The new preferences
 * @property {string} name - The new name of the workspace
 */

/**
 * @typedef {object} UserAuthDTO
 * @property {string} email - The user's email
 * @property {string} password - The user's plaintext password
 */

/**
 * @typedef {object} ReasonDTO
 * @property {string} status - The short status code
 * @property {string} reason - A more detailed reason
 */

/**
 * @typedef {object} PageCreateDTO
 * @property {string} name - The encrypted name of the page
 * @property {string} workspaceId - The workspace to create the page in
 */

/**
 * @typedef {object} PageUpdateDTO
 * @property {string} id - The page id
 * @property {string} name - The encrypted name of the page
 * @property {string} content - The encrypted content of the page
 * @property {string} ownerId - The id of the owner of the page
 * @property {array<string>} adminIds - The ids of users with admin access to this page
 * @property {array<string>} memberIds - The ids of users with member access to this page
 * @property {array<string>} visitorIds - The ids of users with visitor access to this page
 */
