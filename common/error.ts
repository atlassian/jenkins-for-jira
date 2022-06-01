/* eslint-disable max-classes-per-file */
export class JenkinsAppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class JenkinsServerStorageError extends JenkinsAppError {
  constructor(message: string) {
    super(message);
  }
}

export class NoJenkinsServerError extends JenkinsAppError {
  constructor(message: string) {
    super(message);
  }
}

export class JwtVerificationFailedError extends JenkinsAppError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidPayloadError extends JenkinsAppError {
  constructor(message: string) {
    super(message);
  }
}
