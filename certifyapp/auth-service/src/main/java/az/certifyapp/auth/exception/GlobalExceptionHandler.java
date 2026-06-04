package az.certifyapp.auth.exception;

import az.certifyapp.common.error.ApiError;
import az.certifyapp.common.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ApiError> handleIllegal(IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.badRequest()
                .body(ApiError.of(400, ErrorCode.VALIDATION_ERROR, ex.getMessage(), request.getRequestURI()));
    }
}
