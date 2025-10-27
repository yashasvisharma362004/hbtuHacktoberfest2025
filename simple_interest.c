#include <stdio.h>

void calculate_simple_interest(float principal, float rate, float time) {
    float interest;

    interest = (principal * rate * time) / 100;

    printf("Principal: %.2f\n", principal);
    printf("Rate: %.2f%%\n", rate);
    printf("Time: %.2f years\n", time);
    printf("Simple Interest: %.2f\n", interest);
}

int main() {
    // Example calculation
    float p = 5000.00; // Principal
    float r = 5.5;     // Rate
    float t = 2.0;     // Time

    calculate_simple_interest(p, r, t);

    return 0;
}