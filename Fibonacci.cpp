#include <iostream>

void fibonacci_series(int n) {
    int t1 = 0, t2 = 1, nextTerm = 0;

    std::cout << "Fibonacci Series up to " << n << " terms: ";

    for (int i = 1; i <= n; ++i) {
        // Prints the first two terms.
        if(i == 1) {
            std::cout << t1 << ", ";
            continue;
        }
        if(i == 2) {
            std::cout << t2 << ", ";
            continue;
        }

        // Calculates the next term
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;

        std::cout << nextTerm;

        // Add a comma and space unless it is the last term
        if (i < n) {
            std::cout << ", ";
        }
    }
}

int main() {
    int terms = 10; // Number of terms to print
    fibonacci_series(terms);

    return 0;
}