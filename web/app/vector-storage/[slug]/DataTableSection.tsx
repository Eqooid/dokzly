'use client';

import useVectorFile from "@/hooks/store/useVectorFile";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/DataTable";
import { Suspense, useEffect, useState } from 'react';
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
  
export default function DataTableSection(props: { storeId: string }) {
  const { data, initData, isLoading, deleteData } = useVectorFile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(() => {
    initData(props.storeId);
  }, []);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete && deleteData) {
      await deleteData(itemToDelete.id, props.storeId);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const vectorColumns: DataTableColumn<any>[] = [
    { 
      id: 'id', 
      label: 'ID',
      format: (value: string, row: any) => {
        return (
          <Stack direction="row" alignItems="center">
            <DescriptionIcon/>
            &nbsp;
            {value}
          </Stack>
        );
      } 
    },
    { id: 'createdAt', label: 'Created At' }
  ];

  const vectorActions: DataTableAction<any>[] = [
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      onClick: handleDeleteClick,
    }
  ];
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable
        loading={isLoading}
        title={`List of Vector Files (${props.storeId})`}
        showActions={true}
        columns={vectorColumns}
        data={data}
        actions={vectorActions}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this vector file? This action cannot be undone.
          </Typography>
          {itemToDelete && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              File ID: {itemToDelete.id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  );
}