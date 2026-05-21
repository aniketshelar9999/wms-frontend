"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useUser from "../../../hooks/useUser";
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


interface Brands {
    id: string;
    name: string;
    description: string;
}

const columns = [
    { id: "id", label: "ID", minWidth: 80 },
    { id: "name", label: "Brand Name", minWidth: 180 },
    { id: "description", label: "Description", minWidth: 200 },
    { id: "actions", label: "Actions", minWidth: 150 },
];



export default function BrandsPage() {
    const [brands, setBrands] = useState<Brands[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");

    const [isEdit, setIsEdit] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const { user, loading } = useUser() as { user: { role?: string } | null; loading: boolean };
    const router = useRouter();

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // reset to first page when page size changes
    };

    const handleCreateBrand = async () => {
        try {
            const res = await fetch("http://localhost:3000/brands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: brandName,
                    description: brandDescription,
                }),
            });
            if (!res.ok) throw new Error("Failed to create brand");
            toast.success("Brand created successfully");
            setBrandName("");
            setBrandDescription("");
            setOpenModal(false);
            fetchBrands();

        }
        catch (error) {
            console.error("Error creating brand:", error);
            toast.error("Failed to create brand");
        }
    }
    const fetchBrands = async () => {
        try {
            const res = await fetch("http://localhost:3000/brands");
            const data = await res.json();
            setBrands(data);
        }
        catch (error) {
            console.error("Error fetching brands:", error);
        }
    };
    const handleUpdateBrand = async () => {
        try {
            const res = await fetch(`http://localhost:3000/brands/${selectedBrandId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: brandName,
                    description: brandDescription,
                }),
            });

            if (!res.ok) throw new Error("Failed to update brand");
            toast.success("Brand updated successfully");
            // Reset form
            setBrandName("");
            setBrandDescription("");
            setSelectedBrandId(null);
            // setIsEdit(false);
            setOpenModal(false);
            fetchBrands(); // refresh table

        } catch (error) {
            console.error("Update brand error:", error);

        }
    };
    const handleDeleteBrand = async (id: string) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;
        try {
            const res = await fetch(`http://localhost:3000/brands/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete brand");
            fetchBrands();

        }
        catch (error) {
            console.error("Error deleting brand:", error);
        }
    }
    const handleEditBrand = (brand: Brands) => {
        setIsEdit(true);
        setSelectedBrandId(brand.id);
        setBrandName(brand.name);
        setBrandDescription(brand.description);
        setOpenModal(true);
    }

    useEffect(() => {
        fetchBrands();   // call the function
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        router.replace("/login");
        return null;
    }

    if (user.role !== "manager") {
        return <div className="text-red-600 text-xl">Access Denied — Managers Only</div>;
    }


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
                        setBrandName("");
                        setBrandDescription("");
                        setOpenModal(true);
                    }}
                >
                    Add Brands
                </Button>
            </Box>
            <Card sx={{ padding: 2, boxShadow: 4, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Brands
                    </Typography>
                </CardContent>
                <Paper sx={{ width: "100%", overflow: "auto" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow >
                                    {
                                        columns.map((column) => (
                                            <TableCell key={column.id} style={{ minWidth: 80, fontWeight: 600 }}>
                                                {column.label}
                                            </TableCell>
                                        ))
                                    }

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((brand, index) => (
                                        <TableRow key={brand.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{brand.name}</TableCell>
                                            <TableCell>{brand.description}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => handleEditBrand(brand)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteBrand(brand.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[5, 10, 25]}
                        count={brands.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Card>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{isEdit ? "Edit Brand" : "Add Brand"}</DialogTitle>
                <DialogContent>
                    <TextField label="Brand Name" fullWidth margin="dense" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                    <TextField label="Description" fullWidth margin="dense" value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <button onClick={() => setOpenModal(false)}>Cancel</button>

                    <Button
                        variant="contained"
                        disabled={!brandName.trim()}
                        onClick={isEdit ? handleUpdateBrand : handleCreateBrand}
                    >
                        {isEdit ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
