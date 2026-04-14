class Validators {
  static String? required(String? value) {
    if (value == null || value.trim().isEmpty) return 'This field is required';
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!regex.hasMatch(value)) return 'Enter a valid email';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return null;
  }

  static String? positiveNumber(String? value) {
    if (value == null || value.isEmpty) return 'Required';
    final n = double.tryParse(value);
    if (n == null || n <= 0) return 'Must be a positive number';
    return null;
  }

  static String? score(String? value) {
    if (value == null || value.isEmpty) return 'Required';
    final n = double.tryParse(value);
    if (n == null || n < 0 || n > 100) return 'Must be between 0 and 100';
    return null;
  }
}
