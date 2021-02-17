#include <iostream>
using namespace std;
int main()
{
	int P, T;
	cin >> P >> T;
	int cekori = (P * 60 * 2) + (T * 60 * 4);
	cekori = 10000 - cekori;
	cout << cekori;
}