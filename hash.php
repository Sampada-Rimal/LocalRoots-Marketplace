<?php
// Simple one-off: prints a hashed password for qwerty123
// Change 'qwerty123' to any password you want to hash.
$password = 'qwerty123';
echo password_hash($password, PASSWORD_DEFAULT);
