'use client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import useVectorStore from "@/hooks/store/useVectorStore";

export default function HeaderSection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const { add } = useVectorStore();
  
  const handleClickOpen = () => {
    setFormData({ name: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    add(formData.name);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} startIcon={<AddIcon/>} variant="contained">
        Add new Vector Storage
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Vector Storage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new vector storage, please enter its name here.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="storage-form">
             <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              onChange={onChange}
              variant="standard"
              value={formData.name}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="storage-form">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};