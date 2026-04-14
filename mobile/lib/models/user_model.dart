class UserModel {
  final int id;
  final String? name;
  final String? email;
  final String? phone;
  final String role;
  final bool isActive;
  final bool isVerified;

  UserModel({
    required this.id,
    this.name,
    this.email,
    this.phone,
    required this.role,
    required this.isActive,
    required this.isVerified,
  });

  String get displayName => name ?? phone ?? email ?? 'User';

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    phone: json['phone'],
    role: json['role'],
    isActive: json['is_active'],
    isVerified: json['is_verified'],
  );
}
