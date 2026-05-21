"use client";
import React from "react";
import {
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";

interface Category {
    id: string;
    name: string;
}

const columns = [
    { id: "id", label: "ID", minWidth: 80 },
    { id: "name", label: "Category Name", minWidth: 180 },
    { id: "actions", label: "Actions", minWidth: 150 },
];

export default function CategoriesTable() {
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:3000/categories"); // update your API URL
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        console.log("Effect runs");
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleCreate = async () => {
        try {
            const res = await fetch("http://localhost:3000/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: categoryName }),
            });

            const created = await res.json();

            setCategories((prev) => [...prev, created]);
            setOpenModal(false);
            setCategoryName("");

        } catch (error) {
            console.error("Create error:", error);
        }
    };
    const handleUpdate = async () => {
        if (!selectedCategory) return;

        try {
            const res = await fetch(
                `http://localhost:3000/categories/${selectedCategory.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: categoryName }),
                }
            );

            const updated = await res.json();

            setCategories((prev) =>
                prev.map((cat) => (cat.id === updated.id ? updated : cat))
            );

            setOpenModal(false);

        } catch (error) {
            console.error("Update error:", error);
        }
    };
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/categories/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete category");
            }
            // Update UI list
            setCategories((prev) => {
                const updated = prev.filter((cat) => cat.id !== id);

                // If current page becomes empty, go back one page
                const maxPage = Math.max(0, Math.ceil(updated.length / rowsPerPage) - 1);

                if (page > maxPage) {
                    setPage(maxPage);
                }

                return updated;
            });


        } catch (error) {
            console.error("Delete error:", error);
        }
    };
    const handleEdit = async (id: string) => {
        try {
            const category = categories.find((c) => c.id === id) || null;
            if (!category) return;
            setIsEdit(true);
            setSelectedCategory(category);
            console.log("Editing category:", category.name);
            setCategoryName(category.name);
            setOpenModal(true);


        } catch (error) {
            console.error("Delete error:", error);
        }
    };


    return (
        <div>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setIsEdit(false);
                        setCategoryName("");
                        setSelectedCategory(null);
                        setOpenModal(true);
                    }}
                >
                    Add Category
                </Button>
            </Box>
            <Card sx={{ padding: 2, boxShadow: 4, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Categories
                    </Typography>

                    <Paper sx={{ width: "100%", overflow: "auto" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                style={{ minWidth: column.minWidth, fontWeight: 600 }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {categories
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow hover key={row.id}>
                                                {columns.map((column) => {

                                                    // UI ID (1, 2, 3, 4...)
                                                    if (column.id === "id") {
                                                        return (
                                                            <TableCell key={column.id}>
                                                                {page * rowsPerPage + index + 1}
                                                            </TableCell>
                                                        );
                                                    }
                                                    if (column.id === "actions") {

                                                        return (
                                                            <TableCell key={column.id}>
                                                                <IconButton color="primary" onClick={() => handleEdit(row.id)}>
                                                                    <EditIcon />
                                                                </IconButton>

                                                                <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        );
                                                    }

                                                    // Default: show the actual field
                                                    const value = row[column.id as keyof Category];
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={categories.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </CardContent>
            </Card>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>

                    <Button
                        variant="contained"
                        onClick={isEdit ? handleUpdate : handleCreate}
                    >
                        {isEdit ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
