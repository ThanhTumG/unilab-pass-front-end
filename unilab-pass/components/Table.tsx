// Core
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import {
  Button,
  DataTable,
  Icon,
  Text,
  TouchableRipple,
} from "react-native-paper";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

// Types
type Props<T> = {
  data: T[];
  columns: (keyof T)[];
  mode: "access" | "account";
};

// Component
const Table = <T,>({ data, columns, mode }: Props<T>) => {
  // States
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 7, 10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  // Router
  const router = useRouter();

  // Screen Dimension
  const { width, height } = Dimensions.get("window");

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  // Methods
  // Format data
  const formatCell = (col: keyof T, value: any) => {
    if (col === "type") {
      return value === "check in" ? "IN" : "Out";
    }
    if (col === "status") {
      return value === "success" ? (
        <Icon color="green" source={"check-circle-outline"} size={24} />
      ) : (
        <Icon color="red" source={"cancel"} size={24} />
      );
    }
    if (col === "time") {
      return dayjs(String(value), "hh:mm A DD/MM/YYYY").format(
        "DD/MM/YY\nHH:mm"
      );
    }
    return value;
  };

  // Effects
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // Template
  return (
    // Table
    <DataTable
      style={{
        marginVertical: 20,
        width: 0.96 * width,
        height: height - 242,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 3,
        borderCurve: "circular",
      }}
    >
      {/* Header */}
      <DataTable.Header>
        {columns.map((col, _) => (
          <DataTable.Title
            key={String(col)}
            style={{
              maxWidth:
                col == "status" || col == "type"
                  ? 40
                  : col == "id"
                  ? 60
                  : "auto",
              marginHorizontal: 5,
            }}
            textStyle={styles.tabletitle}
          >
            {String(col)}
          </DataTable.Title>
        ))}
      </DataTable.Header>
      <ScrollView alwaysBounceVertical>
        {/* Row */}
        {data.slice(from, to).map((row, index) => {
          if (mode == "access")
            // Access Table
            return (
              <DataTable.Row style={{ minHeight: 70 }} key={index}>
                {columns.map((col, _) => (
                  <DataTable.Cell
                    style={{
                      maxWidth: col == "status" || col == "type" ? 40 : "auto",
                      justifyContent:
                        col == "status" || col == "type"
                          ? "center"
                          : "flex-start",
                      marginHorizontal: 5,
                    }}
                    key={String(col)}
                  >
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatCell(col, row[col])}
                    </Text>
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            );

          // Account Table
          return (
            <DataTable.Row style={{ minHeight: 70 }} key={index}>
              {columns.map((col, _) => (
                <DataTable.Cell
                  style={{
                    maxWidth: col == "id" ? 60 : "auto",
                    justifyContent:
                      col == "status" || col == "type"
                        ? "center"
                        : "flex-start",
                    marginHorizontal: 5,
                  }}
                  key={String(col)}
                >
                  {col == "id" ? (
                    <TouchableRipple
                      rippleColor={"#fff"}
                      onPress={() =>
                        router.replace(`/(stack)/detail/${row[col]}`)
                      }
                    >
                      <Text
                        variant="bodySmall"
                        style={{
                          fontFamily: "Poppins-Regular",
                          color: "#66A3FF",
                        }}
                      >
                        {formatCell(col, row[col])}
                      </Text>
                    </TouchableRipple>
                  ) : (
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatCell(col, row[col])}
                    </Text>
                  )}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          );
        })}

        {/* Pagination */}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${data.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={
            <Text variant="bodySmall">Rows per page</Text>
          }
        />
      </ScrollView>
    </DataTable>
  );
};

export default Table;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabletitle: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textTransform: "capitalize",
  },
  cellText: {
    fontFamily: "Poppins-Regular",
    wordWrap: "break-word",
  },
});
