// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn write_to_file(path: &str, text: &str) -> Result<(), String> {
    use std::fs::File;
    use std::io::Write;

    match File::create(path) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(text.as_bytes()) {
                Err(format!("Failed to write to file: {}", e))
            } else {
                Ok(())
            }
        }
        Err(e) => Err(format!("Failed to create file: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![write_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
