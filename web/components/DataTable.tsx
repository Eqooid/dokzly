'use client';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import { visuallyHidden } from '@mui/utils';

// Types and Interfaces
export interface DataTableColumn<T = any> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: any, row: T, rowIndex: number) => string | React.ReactNode;
}

export interface DataTableAction<T = any> {
  icon: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterConfig {
  search?: string;
  filters?: Record<string, any>;
}

export interface ServerSideConfig {
  enabled: boolean;
  onSort?: (sortConfig: SortConfig) => void | Promise<void>;
  onPageChange?: (page: number, pageSize: number) => void | Promise<void>;
  onSearch?: (searchTerm: string) => void | Promise<void>;
  onFilter?: (filters: Record<string, any>) => void | Promise<void>;
  pagination?: PaginationConfig;
  loading?: boolean;
}

export interface DataTableProps<T = any> {
  // Data props
  data: T[];
  columns: DataTableColumn<T>[];
  
  // Server-side rendering props
  serverSide?: ServerSideConfig;
  
  // Basic props
  title?: string;
  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  dense?: boolean;
  
  // Action props
  actions?: DataTableAction<T>[];
  bulkActions?: {
    icon: React.ReactNode;
    label: string;
    onClick: (selectedItems: T[]) => void;
  }[];
  showActions?: boolean;
  
  // Event handlers
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  
  // State props
  loading?: boolean;
  loadingVariant?: 'circular' | 'linear' | 'skeleton' | 'text';
  loadingMessage?: string;
  loadingOverlay?: boolean; // Show loading overlay instead of replacing content
  emptyMessage?: string;
  
  // Pagination props (for client-side only)
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  
  // Advanced props
  stickyHeader?: boolean;
  maxHeight?: number | string;
  debounceMs?: number;
}

type Order = 'asc' | 'desc';

// Helper functions
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis: [T, number][] = Array.from(array).map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Enhanced Table Head Component
interface EnhancedTableHeadProps<T> {
  columns: DataTableColumn<T>[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  selectable: boolean;
  showActions: boolean;
}

function EnhancedTableHead<T>(props: EnhancedTableHeadProps<T>) {
  const { 
    columns, 
    onSelectAllClick, 
    order, 
    orderBy, 
    numSelected, 
    rowCount, 
    onRequestSort,
    selectable,
    showActions
  } = props;

  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all items',
              }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            align={column.align}
            padding="normal"
            sortDirection={orderBy === column.id ? order : false}
            style={{ minWidth: column.minWidth }}
          >
            {column.sortable !== false ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
        {showActions && <TableCell align="right">Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}

// Custom hooks for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Loading Components
function LoadingRow({ 
  colSpan, 
  variant, 
  message, 
  columns 
}: { 
  colSpan: number; 
  variant: 'circular' | 'linear' | 'skeleton' | 'text';
  message: string;
  columns: DataTableColumn[];
}) {
  switch (variant) {
    case 'skeleton':
      return (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: colSpan }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton 
                    variant="text" 
                    width={cellIndex === 0 ? "60%" : "80%"} 
                    height={20}
                    animation="wave"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      );
    
    case 'linear':
      return (
        <TableRow>
          <TableCell colSpan={colSpan} sx={{ padding: 0 }}>
            <Box sx={{ width: '100%', padding: 2 }}>
              <LinearProgress />
              <Typography 
                variant="body2" 
                align="center" 
                sx={{ marginTop: 2, color: 'text.secondary' }}
              >
                {message}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    
    case 'text':
      return (
        <TableRow>
          <TableCell colSpan={colSpan} align="center" sx={{ padding: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
          </TableCell>
        </TableRow>
      );
    
    case 'circular':
    default:
      return (
        <TableRow>
          <TableCell colSpan={colSpan} align="center" sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
  }
}

// Loading Overlay Component
function LoadingOverlay({ 
  message, 
  variant 
}: { 
  message: string; 
  variant: 'circular' | 'linear' | 'skeleton' | 'text';
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        backdropFilter: 'blur(1px)',
      }}
    >
      {variant === 'linear' ? (
        <Box sx={{ width: '50%', textAlign: 'center' }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {message}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={32} />
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
    </Box>
  );
}

// Enhanced Table Toolbar Component
interface EnhancedTableToolbarProps {
  title?: string;
  numSelected: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchable: boolean;
  filterable: boolean;
  bulkActions?: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
  serverSideLoading?: boolean;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { 
    numSelected, 
    title, 
    searchTerm, 
    onSearchChange, 
    searchable, 
    filterable, 
    bulkActions,
    serverSideLoading 
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 2 }}>
          {title && (
            <Typography
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {title}
            </Typography>
          )}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={serverSideLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}
        </Box>
      )}

      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {bulkActions?.map((action, index) => (
            <Tooltip key={index} title={action.label}>
              <IconButton onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      ) : (
        filterable && (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )
      )}
    </Toolbar>
  );
}

// Main DataTable Component
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  serverSide,
  title,
  selectable = false,
  searchable = false,
  filterable = false,
  paginated = true,
  dense = false,
  actions = [],
  bulkActions = [],
  showActions,
  onRowClick,
  onSelectionChange,
  loading = false,
  loadingVariant = 'circular',
  loadingMessage = "Loading...",
  loadingOverlay = false,
  emptyMessage = "No data available",
  initialRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  stickyHeader = false,
  maxHeight,
  debounceMs = 300,
}: DataTableProps<T>) {
  // State management
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(columns[0]?.id || '');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Client-side pagination state (only used when serverSide is disabled)
  const [clientPage, setClientPage] = React.useState(0);
  const [clientRowsPerPage, setClientRowsPerPage] = React.useState(initialRowsPerPage);
  
  // Server-side states
  const isServerSide = serverSide?.enabled || false;
  const serverLoading = serverSide?.loading || false;
  const currentPage = isServerSide ? (serverSide?.pagination?.page || 0) : clientPage;
  const currentRowsPerPage = isServerSide ? (serverSide?.pagination?.pageSize || initialRowsPerPage) : clientRowsPerPage;
  const totalRows = isServerSide ? (serverSide?.pagination?.total || 0) : data.length;
  
  // Debounced search term for server-side operations
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  
  // Determine if actions column should be shown
  const shouldShowActions = showActions ?? (actions.length > 0);
  
  // Calculate total column count for colSpan
  const totalColumnCount = columns.length + (selectable ? 1 : 0) + (shouldShowActions ? 1 : 0);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    
    if (isServerSide && serverSide?.onSort) {
      serverSide.onSort({
        field: String(property),
        direction: newOrder,
      });
    } else {
      setOrder(newOrder);
      setOrderBy(property);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n, index) => index);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, index: number, item: T) => {
    if (selectable && !onRowClick) {
      const selectedIndex = selected.indexOf(index);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, index);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    } else if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (isServerSide && serverSide?.onPageChange) {
      serverSide.onPageChange(newPage, currentRowsPerPage);
    } else {
      setClientPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (isServerSide && serverSide?.onPageChange) {
      serverSide.onPageChange(0, newRowsPerPage);
    } else {
      setClientRowsPerPage(newRowsPerPage);
      setClientPage(0);
    }
  };

  const isSelected = (index: number) => selected.indexOf(index) !== -1;

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchable) return data;
    
    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.id];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, searchable]);

  // Sort and paginate data (client-side only)
  const processedData = React.useMemo(() => {
    if (isServerSide) {
      // For server-side, return data as-is since server handles sorting/pagination
      return data;
    }
    
    const sorted = stableSort(filteredData, getComparator(order, orderBy));
    if (!paginated) return sorted;
    return sorted.slice(currentPage * currentRowsPerPage, currentPage * currentRowsPerPage + currentRowsPerPage);
  }, [isServerSide, data, filteredData, order, orderBy, currentPage, currentRowsPerPage, paginated]);

  // Handle search with server-side support
  React.useEffect(() => {
    if (isServerSide && serverSide?.onSearch && debouncedSearchTerm !== '') {
      serverSide.onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, isServerSide, serverSide]);

  // Get selected items for bulk actions
  const selectedItems = React.useMemo(() => {
    const sourceData = isServerSide ? data : filteredData;
    return selected.map(index => sourceData[index]).filter(Boolean);
  }, [selected, isServerSide, data, filteredData]);

  // Handle selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  // Enhanced bulk actions with selected items
  const enhancedBulkActions = React.useMemo(() => {
    return bulkActions.map(action => ({
      ...action,
      onClick: () => action.onClick(selectedItems)
    }));
  }, [bulkActions, selectedItems]);

  const emptyRows = paginated && !isServerSide
    ? currentPage > 0 ? Math.max(0, (1 + currentPage) * currentRowsPerPage - filteredData.length) : 0
    : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchable={searchable}
          filterable={filterable}
          bulkActions={enhancedBulkActions}
          serverSideLoading={serverLoading}
        />
        <Box sx={{ position: 'relative' }}>
          <TableContainer sx={{ maxHeight: maxHeight }}>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              stickyHeader={stickyHeader}
            >
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={isServerSide ? data.length : filteredData.length}
              selectable={selectable}
              showActions={shouldShowActions}
            />
            <TableBody>
              {(loading || serverLoading) && !loadingOverlay ? (
                <LoadingRow 
                  colSpan={totalColumnCount}
                  variant={loadingVariant}
                  message={loadingMessage}
                  columns={columns}
                />
              ) : processedData.length === 0 && !(loading || serverLoading) ? (
                <TableRow>
                  <TableCell colSpan={totalColumnCount} align="center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((row, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, index, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={String(column.id)} align={column.align}>
                            {column.format ? column.format(value, row, index) : value}
                          </TableCell>
                        );
                      })}
                      {shouldShowActions && (
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {actions.map((action, actionIndex) => (
                              <Tooltip key={actionIndex} title={action.label}>
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                    }}
                                    disabled={action.disabled ? action.disabled(row) : false}
                                  >
                                    {action.icon}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            ))}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={totalColumnCount} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {loadingOverlay && (loading || serverLoading) && (
          <LoadingOverlay 
            message={loadingMessage}
            variant={loadingVariant}
          />
        )}
        </Box>
        {paginated && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={totalRows}
            rowsPerPage={currentRowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}