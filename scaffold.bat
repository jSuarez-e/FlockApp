@echo off
cd /d D:\ANTIGRAVITY\BlockerCalls

echo [1/5] Limpiando directorios anteriores...
rmdir /s /q backend 2>nul
rmdir /s /q Backend 2>nul
rmdir /s /q Frontend 2>nul
rmdir /s /q Shared 2>nul

echo [2/5] Instalando CLIs globales...
call npm i -g @nestjs/cli @ionic/cli

echo [3/5] Creando Backend...
call nest new Backend --strict --package-manager npm --skip-git
cd Backend
call npm install @nestjs/typeorm typeorm pg class-validator class-transformer @nestjs/config @nestjs/cache-manager cache-manager redis
cd ..

echo [4/5] Creando Frontend (Mobile UI)...
call ionic start Frontend blank --type=angular --standalone --no-git
cd Frontend
call npm install @angular/core@^21.0.0 @angular/common@^21.0.0 @angular/router@^21.0.0 @angular/forms@^21.0.0 @ionic/angular@^9.0.0 @ngrx/signals @capacitor/core @capacitor/android
call npm install -D @capacitor/cli
call npx cap init EscudoRobocalls com.escudo.app
call npx cap add android
cd ..

echo [5/5] Creando directorio Shared...
mkdir Shared

echo Listo! Scaffolding completado con exito.
