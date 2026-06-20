import 'package:flutter/material.dart';

void main() {
  runApp(const VenBraXApp());
}

class VenBraXApp extends StatelessWidget {
  const VenBraXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VenBraX',
      theme: ThemeData.dark(useMaterial3: true),
      home: const Scaffold(
        body: Center(
          child: Text('VenBraX mobile scaffold'),
        ),
      ),
    );
  }
}
