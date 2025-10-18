'use client';

import useVectorStore from "@/hooks/store/useVectorStore";
import DataTable, { DataTableAction, DataTableColumn } from "@/components/DataTable";
import { Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material";
import { Suspense, useEffect, useState } from 'react'
import {
  Storage as StorageIcon,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';

export default function DataTableSection() {
  const { data, initData, isLoading, deleteData, updateData } = useVectorStore();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editName, setEditName] = useState('');

  const router = useRouter();

  useEffect(() => {
    initData();
  }, []);

  const handleDeleteClick = (row: any) => {
    setSelectedItem(row);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (row: any) => {
    setSelectedItem(row);
    setEditName(row.name);
    setOpenEditDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedItem(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedItem(null);
    setEditName('');
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      handleCloseDeleteDialog();
      await deleteData(selectedItem.id);
    }
  };

  const handleConfirmEdit = async () => {
    if (selectedItem && editName.trim() && updateData) {
      handleCloseEditDialog();
      await updateData(selectedItem.id, editName.trim());
    }
  };

  const vectorColumns: DataTableColumn<any>[] = [
    { 
      id: 'id', 
      label: 'Name',
      format: (value: string, row: any) => {
        return (
          <Stack direction="row" alignItems="center">
            <StorageIcon fontSize="large" style={{ verticalAlign: 'middle', marginRight: 7 }} />
            <div>
              {row.name}
              <br/>
              <small style={{color:"#666"}}>{value}</small>
            </div>
          </Stack>
         
        );
      } 
    },
    { id: 'createdAt', label: 'Created At' }
  ];
  
  const vectorActions: DataTableAction<any>[] = [
    {
      icon: <VisibilityIcon/>,
      label: 'View',
      onClick: (row: any) => {
        router.push(`/vector-storage/${row.id}`);
      }
    },
    {
      icon: <EditIcon/>,
      label: 'Edit',
      onClick: (row: any) => {
        handleEditClick(row);
      }
    },
    {
      icon: <DeleteIcon/>,
      label: 'Delete',
      onClick: (row: any) => {
        handleDeleteClick(row);
      }
    }
  ];

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable initialRowsPerPage={5}
          loading={isLoading} 
          actions={vectorActions} 
          showActions={true} 
          data={data} 
          columns={vectorColumns} 
          title="List of Vector Storage"/>
      </Suspense>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">
          Edit Storage Name
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a new name for "{selectedItem?.name}":
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Storage Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirmEdit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmEdit} 
            color="primary" 
            variant="contained"
            disabled={!editName.trim() || editName.trim() === selectedItem?.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}