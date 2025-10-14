import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  statusRunning: {
    color: theme.palette.success.main,
  },
  statusStopped: {
    color: theme.palette.error.main,
  },
}));

interface VM {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  size: string;
  image: string;
  resourceGroup: string;
}

export const VmList = () => {
  const classes = useStyles();
  const [vms, setVms] = useState<VM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement Azure SDK integration to fetch VMs
    const fetchVms = async () => {
      try {
        // Mock data for now
        const mockVms: VM[] = [
          {
            id: '1',
            name: 'dev-vm-1',
            status: 'running',
            size: 'Standard_B2s',
            image: 'Development Image',
            resourceGroup: 'dev-resources',
          },
          {
            id: '2',
            name: 'test-vm-1',
            status: 'stopped',
            size: 'Standard_D2s_v3',
            image: 'Testing Image',
            resourceGroup: 'test-resources',
          },
        ];
        setVms(mockVms);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching VMs:', error);
        setLoading(false);
      }
    };

    fetchVms();
  }, []);

  const handleStart = async (id: string) => {
    // TODO: Implement VM start logic
    console.log('Starting VM:', id);
  };

  const handleStop = async (id: string) => {
    // TODO: Implement VM stop logic
    console.log('Stopping VM:', id);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement VM deletion logic
    console.log('Deleting VM:', id);
  };

  if (loading) {
    return <Typography>Loading VMs...</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Resource Group</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vms.map((vm) => (
            <TableRow key={vm.id}>
              <TableCell>{vm.name}</TableCell>
              <TableCell>
                <Typography
                  className={
                    vm.status === 'running'
                      ? classes.statusRunning
                      : classes.statusStopped
                  }
                >
                  {vm.status}
                </Typography>
              </TableCell>
              <TableCell>{vm.size}</TableCell>
              <TableCell>{vm.image}</TableCell>
              <TableCell>{vm.resourceGroup}</TableCell>
              <TableCell>
                {vm.status === 'stopped' ? (
                  <IconButton onClick={() => handleStart(vm.id)}>
                    <PlayArrowIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleStop(vm.id)}>
                    <StopIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDelete(vm.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};