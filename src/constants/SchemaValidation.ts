export const SCHEMA = {  
  // General
  NAME_REQ: "Name is Required",
  NAME_MAX: "Name must be 50 characters or less",
  NAME_VALID:"Name is not valid",
  EMAIL_REQ: "Email is Required",
  EMAIL_VALID: "Enter a valid email",
  EMAIL_MAX: "Email must be 50 characters or less",
  STARTDATE_VALID:"Start date cannot be in the past",
  STARTDATE_REQ:"Start date is required",
  ENDDATE_VALID:"Start date cannot be in the past",
  ENDDATE_REQ:"End date is required",
  STATUS_REQ:"Status is required",
  
  // auth schema
  PASSWORD_MAX: "Password must be 50 characters or less",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_REQ: "Password is required",
  STRONG_PASSWORD:
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
  CONFIRM_PASSWORD_MATCH: "New password and confirm password does not match",

  // project schema
  PROJECT_MAX: "Name must be 30 characters or less",
  DESC_MAX: "Description must be 200 characters or less",
  MEMBER_REQ: "Member is required"
};