from fastapi import HTTPException, status


class AppException:

    @staticmethod
    def invalid_credentials():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    @staticmethod
    def unauthorized():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    @staticmethod
    def forbidden():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    @staticmethod
    def password_valid():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be different"
        )

    @staticmethod
    def user_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    @staticmethod
    def user_already_exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

    @staticmethod
    def medicine_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found"
        )

    @staticmethod
    def supplier_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found"
        )

    @staticmethod
    def customer_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    @staticmethod
    def order_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    @staticmethod
    def inventory_not_found():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found"
        )

    @staticmethod
    def insufficient_stock():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock available"
        )

    @staticmethod
    def expired_medicine():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Medicine has expired"
        )

    @staticmethod
    def duplicate_batch():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Batch number already exists"
        )

    @staticmethod
    def validation_error(message: str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    @staticmethod
    def internal_server_error():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )