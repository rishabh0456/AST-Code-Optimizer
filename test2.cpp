#include <bits/stdc++.h>
using namespace std;

/*
    This file contains intentionally UNOPTIMIZED algorithms.
    You can improve them later.
*/

// 1️⃣  Fibonacci (Exponential Time - O(2^n))
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);  // Very slow for large n
}

// 2️⃣  Prime Check (O(n))
bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i < n; i++) {  // Should be up to sqrt(n)
        if (n % i == 0)
            return false;
    }
    return true;
}

// 3️⃣  Bubble Sort (O(n^2))
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1; j++) {  // Not optimized (no shrinking window)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
        }
    }
}

// 4️⃣  Subarray Sum (Brute Force - O(n^3))
int maxSubarraySum(vector<int>& arr) {
    int n = arr.size();
    int maxSum = INT_MIN;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int sum = 0;
            for (int k = i; k <= j; k++) {
                sum += arr[k];
            }
            maxSum = max(maxSum, sum);
        }
    }
    return maxSum;
}

// 5️⃣  Duplicate Check (O(n^2))
bool containsDuplicate(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] == arr[j])
                return true;
        }
    }
    return false;
}

// Driver Code
int main() {
    cout << "Testing Unoptimized Algorithms\n";

    // Fibonacci
    cout << "Fibonacci(10): " << fibonacci(10) << endl;

    // Prime Check
    cout << "Is 97 Prime? " << (isPrime(97) ? "Yes" : "No") << endl;

    // Bubble Sort
    vector<int> arr = {5, 3, 8, 4, 2};
    bubbleSort(arr);
    cout << "Sorted Array: ";
    for (int x : arr)
        cout << x << " ";
    cout << endl;

    // Max Subarray Sum
    vector<int> arr2 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Max Subarray Sum: " << maxSubarraySum(arr2) << endl;

    // Duplicate Check
    vector<int> arr3 = {1, 2, 3, 4, 5, 3};
    cout << "Contains Duplicate? " << (containsDuplicate(arr3) ? "Yes" : "No") << endl;

    return 0;
}