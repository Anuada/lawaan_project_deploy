<?php

// File to store data
$dataFile = '../dataFile/data.txt';
require_once "../logic/logic.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD with Text File</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container py-5">
        <h1 class="text-center mb-4">CRUD with Text File in PHP</h1>
       
        <!-- Add Record Button -->
        <div class="text-end mb-3">
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">Add New Record</button>
        </div>

        <!-- Records Table -->
        <h2 class="mb-3">Records</h2>
        <table class="table table-striped table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($records as $record): ?>
                    <tr>
                        <td><?= htmlspecialchars($record['name']) ?></td>
                        <td><?= htmlspecialchars($record['email']) ?></td>
                        <td>
                            <!-- Update Button -->
                            <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#updateModal<?= $record['id'] ?>">Update</button>

                            <!-- Update Modal -->
                            <div class="modal fade" id="updateModal<?= $record['id'] ?>" tabindex="-1" aria-labelledby="updateModalLabel<?= $record['id'] ?>" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="updateModalLabel<?= $record['id'] ?>">Update Record</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form method="POST">
                                                <input type="hidden" name="action" value="update">
                                                <input type="hidden" name="id" value="<?= $record['id'] ?>">
                                                <div class="mb-3">
                                                    <label class="form-label">Name</label>
                                                    <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($record['name']) ?>" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Email</label>
                                                    <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($record['email']) ?>" required>
                                                </div>
                                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delete Link -->
                            <a href="?delete=<?= $record['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</a>

                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Add Modal -->
    <!-- Add Modal -->
<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addModalLabel">Add New Record</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form method="POST">
                    <input type="hidden" name="action" value="create"> <!-- Changed from 'add' to 'create' -->
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Record</button>
                </form>
            </div>
        </div>
    </div>
</div>


    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
