import React, { useState, useMemo } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { delPreventive } from "../../features/PrevenMainSlice";
import EditPreventive from "./EditPreventive";
import DetailsPreventive from "./DetailsPreventive";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { printDate } from "../../utils/Functions";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListPreventives = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { preventives, isLoading, error } = useSelector(
    (state) => state.storePreventives
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRow(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  const handleRowClick = (row) => {
    setSelectedRow(row.original);
    setShowDetails(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirm Deleting")) {
      dispatch(delPreventive(id));
      toast(`Preventive with ID : ${id} Deleted`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const columns = useMemo(
    () => [
      /*     {
                accessorKey: 'image', //access nested data with dot notation
                header: 'Image machine',
                Cell: ({ cell }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <img
                            alt=""
                            height={60}
                            src={cell.getValue()}
                            loading="lazy"
                            style={{ borderRadius: '20%' }}
                        />

                    </Box>),



            }, */

      {
        accessorKey: "machineID.nameMachine", //access nested data with dot notation
        header: "Machine",
        size: 100,
      },
      {
        accessorKey: "employeeID",
        header: "Employee",
        size: 100,
        Cell: ({ cell }) => (
          <div>
            {cell.getValue().filter(Boolean).map((employee) => (
              <p key={employee._id}>{employee.firstname}</p>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "departmentID.nameDepartment", //normal accessorKey
        header: "Department",
        size: 100,
      },
      {
        accessorKey: "dateStart",
        header: "Date Start",
        size: 100,
      },
      {
        accessorKey: "dateEnd",
        header: "Date End",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
      },

      {
        accessorKey: "_id",
        header: "actions",
        size: 100,
        Cell: ({ cell, row }) => (
          <div>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(cell.row.original);
              }}
              size="md"
              className="text-warning btn-link edit"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(
                  cell.row.original._id,
                  cell.row.original.nameMachine
                );
              }}
              size="md"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" />
            </Button>
          </div>
        ),
      },
    ],
    [preventives]
  );
  if (isLoading)
    return (
      <center>
        <ReactLoading
          type="spokes"
          color="green"
          height={"10%"}
          width={"10%"}
        />
      </center>
    );
  if (error) return <p>Cannot display preventives list due to errors</p>;

  const handleExportData = () => {
    const doc = new jsPDF();
    const headers = columns.slice(0, -1).map((column) => column.header);
    const accessorKeys = columns
      .slice(0, -1)
      .map((column) => column.accessorKey);
    const data = preventives.map((preventive) =>
      accessorKeys.map((key) => {
        // Split the key into parts
        const parts = key.split(".");
        // Use reduce to navigate the nested objects
        return parts.reduce((obj, part) => obj && obj[part], preventive);
      })
    );

    doc.autoTable({
      head: [headers],
      body: data,
      styles: {
        minCellHeight: 2, // Reduce the height of all rows
        lineWidth: 0.1, // Set line width for all cells
        lineColor: [190, 190, 190], // Set line color for all cells
        halign: "center", // Align all text in the center
        valign: "middle", // Align all text in the middle vertically
      },
    });

    printDate(doc);
    doc.save("sample.pdf");
  };

  const handleExportSelectedRows = (selectedRows) => {
    const doc = new jsPDF();
    const headers = columns.slice(0, -1).map((column) => column.header); // Exclude the last column
    const accessorKeys = columns
      .slice(0, -1)
      .map((column) => column.accessorKey); // Exclude the last column
    const data = selectedRows.map((row) =>
      accessorKeys.map((key) => {
        // Split the key into parts
        const parts = key.split(".");
        // Use reduce to navigate the nested objects
        return parts.reduce((obj, part) => obj && obj[part], row.original);
      })
    );

    doc.autoTable({
      head: [headers],
      body: data,
      styles: {
        minCellHeight: 2, // Reduce the height of all rows
        lineWidth: 0.1, // Set line width for all cells
        lineColor: [190, 190, 190], // Set line color for all cells
        halign: "center", // Align all text in the center
        valign: "middle", // Align all text in the middle vertically
      },
    });
    printDate(doc);
    doc.save("selected-rows.pdf");
  };
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={preventives}
        enableRowSelection
        muiTableBodyRowProps={({ row, rowIndex }) => ({
          onClick: (event) => {
            // Get the cell index from the event target
            const cellIndex = event.target.cellIndex;

            // Get the number of columns in the table
            const numColumns = columns.length;

            // Check if the clicked cell is not in the last column
            if (cellIndex !== numColumns - 1) {
              handleRowClick(row);
            }
          },
          sx: {
            cursor: "pointer",
          },
        })}
        positionToolbarAlertBanner="bottom"
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() =>
                handleExportSelectedRows(table.getSelectedRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Selected Rows
            </Button>
          </Box>
        )}
      />
      {showModal && (
        <EditPreventive
          show={showModal}
          handleClose={handleClose}
          preventive={selectedItem}
        />
      )}

      {showDetails && (
        <DetailsPreventive
          showDetails={showDetails}
          handleCloseDetails={handleCloseDetails}
          preventive={selectedRow}
        />
      )}
    </>
  );
};

export default ListPreventives;
