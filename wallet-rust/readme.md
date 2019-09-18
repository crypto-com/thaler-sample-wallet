# electron dev dependency
```
  "devDependencies": {
    "electron": "^4.1.1",
    "electron-build-env": "^0.2",
    "electron-packager": "^14.0.6",
    "neon-cli": "^0.3.1"
  },
```

# electron build
```
electron-build-env neon build hello-world --release
```

# electron packaging
```
yarn build && electron-build-env electron-packager .
```

# neon binding with electron4
vi ~/.cargo/config
```
[build]
rustflags = ["-Ctarget-feature=+aes,+ssse3"]

[target.'cfg(windows)']
rustflags = ["-C", "link-args=/DELAYLOAD:node.exe /INCLUDE:__pfnDliNotifyHook2 delayimp.lib", "-Ctarget-feature=+aes,+ssse3"]
```

# add delay hook in native rust
hello-world/native/src/win_delay_load_hook.cc 
```
/*
 * When this file is linked to a DLL, it sets up a delay-load hook that
 * intervenes when the DLL is trying to load 'node.exe' or 'iojs.exe'
 * dynamically. Instead of trying to locate the .exe file it'll just return
 * a handle to the process image.
 *
 * This allows compiled addons to work when node.exe or iojs.exe is renamed.
 */

 
#include <windows.h>

#include <delayimp.h>
#include <string.h>

FARPROC WINAPI load_exe_hook(unsigned int event, DelayLoadInfo* info) {
  HMODULE m;
  if (event != dliNotePreLoadLibrary)
    return NULL;

  if (_stricmp(info->szDll, "node.exe") != 0)
    return NULL;

	
  m = GetModuleHandle(NULL);
  return (FARPROC) m;
}

decltype(__pfnDliNotifyHook2) __pfnDliNotifyHook2 = load_exe_hook;
```

# build native
hello-world/native/build.rs
```
use neon_build;
extern crate cc;

// windows, linux, macos, ios, android, freebsd
#[cfg(target_os = "windows")]
fn process_delay_hook() {
    cc::Build::new()
        .cpp(true)
        .static_crt(true)
        .file("src/win_delay_load_hook.cc")
        .compile("hook");
}

#[cfg(not(target_os = "windows"))]
fn process_delay_hook() {}

fn main() {
    neon_build::setup(); // must be called in build.rs

    // add project-specific build logic here...
    process_delay_hook();
}

```
