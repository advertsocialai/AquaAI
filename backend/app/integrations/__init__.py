"""External-service adapters. Each module wraps one upstream provider
behind a typed interface. All adapters return mock data when the
matching env var is not set, so dev + CI never need real credentials.
"""
