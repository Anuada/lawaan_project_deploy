<?php
function readData($file)
{
    if (!file_exists($file)) {
        return []; // Return an empty array if the file doesn't exist
    }
    $content = file_get_contents($file);
    return $content ? unserialize($content) : []; // Return an empty array if the file is empty
}

// Function to write data to the file
function writeData($file, $data)
{
    file_put_contents($file, serialize($data));
}

// Initialize the records variable
$records = readData($dataFile);

// CREATE
if (isset($_POST['action']) && $_POST['action'] === 'create') {
    $newRecord = [
        'id' => uniqid(), // Unique ID
        'name' => $_POST['name'],
        'email' => $_POST['email']
    ];
    $records[] = $newRecord;
    writeData($dataFile, $records);
    header("Location: {$_SERVER['PHP_SELF']}");
    exit;
}

// UPDATE
if (isset($_POST['action']) && $_POST['action'] === 'update') {
    foreach ($records as &$record) {
        if ($record['id'] === $_POST['id']) {
            $record['name'] = $_POST['name'];
            $record['email'] = $_POST['email'];
        }
    }
    writeData($dataFile, $records);
    header("Location: {$_SERVER['PHP_SELF']}");
    exit;
}

// DELETE
if (isset($_GET['delete'])) {
    $records = array_filter($records, function ($record) {
        return $record['id'] !== $_GET['delete'];
    });
    writeData($dataFile, $records);
    header("Location: {$_SERVER['PHP_SELF']}");
    exit;
}