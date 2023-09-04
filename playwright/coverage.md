# Functionality covered in automated tests:
<details>
 <summary>Create simple API</summary>

+ User should be able to create new API
+ New API should be visible in table
+ User should be able to delete API
+ Deleted API should not be visible
</details>
<details>
 <summary>Test Search functionality on OAS API Page</summary>

+ User should be able to open search bar by clicking search icon
+ User should be able to close search bar by clicking X icon
+ User should be able to open search bar with keyboard shortcut ctrl+f
+ User should be able to close search bar with keyboard shortcut ESC
+ User should be able to open search bar with keyboard shortcut cmd+f
+ User should be able to search by main section title
+ User should be able to search by "potential match" text
+ User should be able to see multiple results when typing
+ User should be able to clear search results
</details>
<details>
 <summary>Create policy page - settings tests</summary>

+ Prerequisits: creating API definition via dashboard API
+ User should be able to create policy with Access Denied status
+ Policy settings should be persistent after page reload
+ User should be able to create policy with Draft status
+ Policy settings should be persistent after page reload
+ User should be able to create policy with Active status
+ Policy settings should be persistent after page reload
</details>
<details>
 <summary>Create/update/delete tags on policy</summary>

+ Prerequisits: creating API definition via dashboard API
+ User should be able to create new Policy with tag
+ Confirmation popup should be displayed
+ Tag: original_tag should be displayed after policy reload
+ User should be able to edit tag on Policy
+ Confirmation popup should be displayed
+ Updated tag: updated_tag should be displayed after policy reload
+ User should be able to delete tag from policy
+ Confirmation popup should be displayed
+ User should be able to add multiple tags on Policy
+ Three tags should be displayed after policy reload
</details>
<details>
 <summary>Portal Settings main Admin page</summary>

+ User should see proper default values
+ User should be able to edit all fields and save changes without error
+ User should see saved values after re-load values
</details>
<details>
 <summary>Portal Settings - API access manipulations</summary>

+ User should see proper default values
+ User should be able to edit all fields and save changes without error
+ User should see saved values after re-load values
</details>
<details>
 <summary>Portal Settings - API access manipulations</summary>

+ DCR should be disabled by default
+ If DCR is enabled fields become mandatory
+ User should be able to edit DCR details and save changes without error
+ User should see saved values after re-load values
+ User is able to save Settings with DCR turned off (fields are no longer mandatory)
</details>
<details>
 <summary>Portal Settings - emails</summary>

+ User should see proper default values
+ User is able to edit global email settings
+ User is able to edit Welcome email settings
+ User is able to edit global email CSS
+ User should see saved values after re-load
+ User should be  able to reset email settings
</details>
<details>
 <summary>TIB profile creation tests</summary>

+ User should be able to add SAML profile
+ User should be able to open SAML profile
+ User should be able to add LDAP profile
+ User should be able to open LDAP profile
+ User should be able to add OpenID profile
+ User should be able to open OpenID profile
+ User should be able to add Social profile
+ User should be able to open Social profile
</details>
<details>
 <summary>Users creation</summary>

+ Admin should NOT be able to create user with invalid email
+ Admin should be able to create inactive user
+ Admin should NOT be able to create user with already existing email
+ Admin should NOT be able to create user with short password
+ Admin should be able to create user with limited permissions
</details>
<details>
 <summary>Create/update/delete users</summary>

+ Admin should be able to create new user
+ Admin should be able to edit created user
+ Admin should be able to delete user
</details>
<details>
 <summary>Test mandatory fields on OAS API designer page</summary>

+ API Name is required on popup
+ API Name is required on main designer page
+ Listen Path is required on main designer page
+ Target URL is required on main designer page
+ Access is required on main designer page
+ GW Status is required on main designer page
+ Authentication is required on main designer page
+ Auth Key Header is required on main designer page
</details>
<details>
 <summary>Test Landing Page</summary>

+ User should see Landing Page after loggin in with 0 APIs
+ User should see Landing Page when navigating with 0 APIs
+ User should not see Landing Page when loggin in with 1 API
+ User should not see Landing Page when navigating with 1 API
+ User should see Landing Page after all APIs were deleted
</details>
<details>
 <summary>Multiple APIs policies</summary>

+ Prerequisits: creating API definitions via dashboard API
+ User should be able to create new Policy with multiple APIs
+ User can't add policy with different Authorization type to policy
+ User should be able to add API with tha same Authorization type to policy
+ User should be able to see all APIs assigned to policy
+ User should be able to delete API access from policy
</details>
<details>
 <summary>Test API search functionality on Add Policy Page</summary>

+ Prerequisits: creating API definitions via dashboard API
+ User should be able search API by name
+ User should be able to change API name in search criteria
+ User should be able to clear API name in search criteria
+ User should be able to search by single Authentication type 
+ User should be able to clear Authentication type in search criteria
+ User should be able to search by multiple Authentication types 
+ User should be able to search by Api name plus Authentication type 
</details>
<details>
 <summary>Create/update/delete policies</summary>

+ Prerequisits: creating API definition via dashboard API
+ User should be able to create new Policy
+ Confirmation popup should be displayed
+ User should be able to edit created Policy
+ Changes should be displayed after reload. Key expiry: 6 hours
+ User should be able to delete policy
</details>
<details>
 <summary>Test Policy search functionality on Main Policy Page</summary>

+ Prerequisits: creating API and Policy definitions via dashboard API
+ User should be able search policy by Policy name
+ User should be able search policy by Policy id
+ User should be able search policy by Access Right
+ User should be able search policy by Authentication type
+ User should be able search policy by multiple criteria - Name + Auth type
+ User should be able search policy by multiple criteria - Name + Access Right
+ User should be able search policy by multiple criteria - Auth Type + Access Right
</details>
<details>
 <summary>Create/update/delete tags on policy</summary>

+ Prerequisits: creating API definition via dashboard API
+ User should see error message on Access Rights tab if no API was selected
+ User should not see errors on Access Rights tab if 1 API was selected
+ User should see errors on Configurations tab - Name and Expiry missing
+ User should be able to save Policy onces all mandatory fields are entered
+ Confirmation popup should be displayed
</details>
<details>
 <summary>Create/update/delete metadata on policy</summary>

+ Prerequisits: creating API definition via dashboard API
+ User should be able to create new Policy with metadata
+ Confirmation popup should be displayed
+ Metadata should be displayed after policy reload
+ User should be able to edit metadata on Policy
+ Confirmation popup should be displayed
+ Updated metadata should be displayed after policy reload
+ User should be able to delete metadata from policy
+ Confirmation popup should be displayed
+ No metadata should be displayed after policy reload
+ User should be able to add multiple metadata on Policy
+ Three medatada should be displayed after policy reload
</details>
