# EndPoints

## Roles

1. ### EndUSer
   1. {{url}}/api/user/auth ✅
      1. /login
      2. /signup
      3. /forgetpassword
      4. /verify-otp
      5. /resend-otp
      6. /changePassword
      7. /reset-with-old-password
   2. {{url}}/api/user/profile ✅
      1. /setup
      2. /edit
      3. /view
   3. {{url}}/api/user/requests ✅
      1. /received
      2. /review/:status/:requestId
      3. /send/:status/:userId
   4. {{url}}/api/user/connections ✅
      1. /view
      2. /remove/:connectionId (requestId) ❌
   5. {{url}}/api/user/info ✅
      1. /faq
      2. /issue-raised
      3. /issue-view
      4. /issue-types
   6. {{url}}/api/user/notitifications ✅
      1. /store-token
      2. /delete-token
   7. {{url}}/api/user/avatar ✅
   8. {{url}}/api/user/toggle-is-fav/:connectionid ✅
   9. {{url}}/api/user/feed/:page (query for age range and oppositeGender ) ✅
