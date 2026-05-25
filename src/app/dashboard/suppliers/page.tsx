"use client";

import toast from "react-hot-toast";
import useUser from "../../../hooks/useUser";
import { useRouter } from "next/navigation";
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
import AddIcon from "@mui/icons-material/Add";

import { useState, useEffect } from "react";

const columns = [
    { id: "id", label: "ID", minWidth: 80 },
    { id: "name", label: "Category Name", minWidth: 180 },
    { id: "email", label: "Email", minWidth: 200 },
    { id: "phone", label: "Phone", minWidth: 200 },
    { id: "address", label: "Address", minWidth: 200 },
    { id: "actions", label: "Actions", minWidth: 150 }
];

interface Suppliers {
    id: string;
    name: string;
    description: string;
    contactEmail: string;
    phone: string;
    address: string;
}

export default function SuppliersPage() {
    const { user, loading } = useUser() as { user: { role?: string } | null; loading: boolean };
    const router = useRouter();


    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedSupplierID, setSelectedSupplierID] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
    const [name, setName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const handleCreateSupplier = async () => {
        try {
            const res = await fetch("http://localhost:3000/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    contactEmail: contactEmail,
                    phone: phone,
                    address: address,
                }),
            });
            if (!res.ok) throw new Error("Failed to create supplier");
            toast.success("supplier created successfully");
            setName("");
            setContactEmail("");
            setPhone("");
            setAddress("");
            setOpenModal(false);
            await fetchSuppliers();

        }
        catch (error) {
            console.error("Error creating supplier:", error);
            // toast.error("Failed to create supplier");
        }
    }
    const fetchSuppliers = async () => {
        try {
            const response = await fetch("http://localhost:3000/suppliers");
            const data = await response.json();
            console.log("Fetched suppliers data or not:", data);
            setSuppliers(data);
            console.log("Fetched suppliers:", suppliers);
        }
        catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }
    const handleDeleteSupplier = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Supplier?")) return;
        try {
            const res = await fetch(`http://localhost:3000/suppliers/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete supplier");
            await fetchSuppliers();
            // FIX: If the current page becomes empty, go back one page
            if (page > 0 && paginatedRows.length === 1) {
                setPage(page - 1);
            }

        }
        catch (error) {
            console.error("Error deleting supplier:", error);
        }
    }
    const handleSupplier = (supplier: Suppliers) => {
        setIsEdit(true);
        setSelectedSupplierID(supplier.id);
        setName(supplier.name);
        setContactEmail(supplier.contactEmail);
        setPhone(supplier.phone);
        setAddress(supplier.address);
        setOpenModal(true);
    }
    const filteredData = suppliers.filter((supplier) => {
        const q = search.toLowerCase();
        return (
            supplier.name.toLowerCase().includes(q) ||
            supplier.contactEmail.toLowerCase().includes(q) ||
            supplier.phone.toLowerCase().includes(q) ||
            supplier.address.toLowerCase().includes(q)
        );
    });
    const rowsToRender = search ? filteredData : suppliers;

    const paginatedRows = rowsToRender.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );


    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleUpdateSupplier = async () => {
        try {
            const res = await fetch(`http://localhost:3000/suppliers/${selectedSupplierID}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    contactEmail: contactEmail,
                    phone: phone,
                    address: address,
                }),
            });

            if (!res.ok) throw new Error("Failed to update brand");
            toast.success("Brand updated successfully");
            // Reset form
            setName("");
            setContactEmail("");
            setPhone("");
            setAddress("");
            setIsEdit(false);
            setOpenModal(false);
            fetchSuppliers(); // refresh table

        } catch (error) {
            console.error("Update brand error:", error);

        }
    };


    useEffect(() => {
        fetchSuppliers();
        console.log("Fetchingsuppliers...", suppliers);
    }, []);

    useEffect(() => {
        console.log("Suppliers updated:", suppliers);
    }, [suppliers]);

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
            <Box
                sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }} >
                <Button variant="contained"
                    color="primary"
                    startIcon={<AddIcon />} onClick={() => {
                        setIsEdit(false);
                        setOpenModal(true);
                        setName("");
                        setContactEmail("");
                        setPhone("");
                        setAddress("");
                    }}>Add Category</Button>
            </Box >
            <Card sx={{ padding: 2, boxShadow: 4, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Suppliers
                    </Typography>
                </CardContent>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2, width: "100%", }}
                    fullWidth

                />
                <Paper sx={{ width: "100%", overflow: "auto" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => {
                                        return (<TableCell key={column.id} style={{ minWidth: column.minWidth, fontWeight: 600 }}> {column.label} </TableCell>)
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>{
                                paginatedRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                            No records found
                                        </TableCell>
                                    </TableRow>
                                ) : (paginatedRows.map((supplier, index) => {
                                    return (<TableRow key={supplier.id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{supplier.name}</TableCell>
                                        <TableCell>{supplier.contactEmail}</TableCell>
                                        <TableCell>{supplier.phone}</TableCell>
                                        <TableCell>{supplier.address}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleSupplier(supplier)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteSupplier(supplier.id)} >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>)
                                }))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={rowsToRender.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </TableContainer>

                </Paper >
            </Card >
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Add Supplier</DialogTitle>

                <DialogContent>
                    <TextField
                        label=" Supplier Name"
                        fullWidth
                        margin="dense"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        value={contactEmail}
                        onChange={(e) => { setContactEmail(e.target.value) }}
                    />

                    <TextField
                        label="phone"
                        fullWidth
                        margin="dense"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}
                    />

                    <TextField
                        label="Address"
                        fullWidth
                        margin="dense"
                        value={address}
                        onChange={(e) => { setAddress(e.target.value) }}
                    />
                </DialogContent>

                <DialogActions>
                    <button>Cancel</button>

                    <Button variant="contained" disabled={!name.trim()} onClick={isEdit ? handleUpdateSupplier : handleCreateSupplier}>
                        {isEdit ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

        </div >
    );
}

