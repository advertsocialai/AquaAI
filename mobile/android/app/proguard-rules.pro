# Aqua AI · ProGuard rules

# Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# TensorFlow Lite
-keep class org.tensorflow.** { *; }
-keep class org.tensorflow.lite.gpu.GpuDelegate { *; }
-keep class org.tensorflow.lite.flex.FlexDelegate { *; }

# Firebase
-keep class com.google.firebase.** { *; }

# Kotlin
-keep class kotlin.** { *; }
-dontwarn kotlin.**

# Reflection used by Riverpod codegen
-keepattributes *Annotation*, Signature, Exceptions
