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

#[tauri::command]
fn read_from_file(path: &str) -> Result<String, String> {
    use std::fs::File;
    use std::io::Read;

    match File::open(path) {
        Ok(mut file) => {
            let mut contents = String::new();
            if let Err(e) = file.read_to_string(&mut contents) {
                Err(format!("Failed to read file: {}", e))
            } else {
                Ok(contents)
            }
        }
        Err(e) => Err(format!("Failed to open file: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![write_to_file, read_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
