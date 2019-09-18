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
