package az.certifyapp.common.exception;

import az.certifyapp.common.error.ErrorCode;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }
}
