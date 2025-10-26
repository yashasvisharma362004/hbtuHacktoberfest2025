# Simple Python script to calculate the factorial of a number.

def factorial(n):
    """Calculates the factorial of a non-negative integer n."""
    if n == 0 or n == 1:
        return 1
    else:
        result = 1
        for i in range(2, n + 1):
            result *= i
        return result

# Example usage:
number = 5
print(f"The factorial of {number} is: {factorial(number)}")