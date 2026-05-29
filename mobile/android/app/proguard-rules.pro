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

# Play Core (deferred components) — Flutter references these defensively
# but we don't ship as a split-install app, so silence R8.
-dontwarn com.google.android.play.core.**
-keep class com.google.android.play.core.** { *; }

# TFLite GPU delegate — referenced by tflite_flutter but we don't bundle
# the GPU delegate AAR (CPU-only inference).
-dontwarn org.tensorflow.lite.gpu.**
