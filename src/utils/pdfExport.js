import React from "react";
import brasilLocal from "date-fns/locale/pt-BR";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { format } from "date-fns";

export const exporta = (id, info, periodo, callback) => {
  const dados = document.getElementById(id);
  html2canvas(dados, {}).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const style = StyleSheet.create({
      page: {
        backgroundColor: "#fff",
        width: "100%",
        orientation: "portrait",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      view: {
        width: "350px",
        height: "320px",
      },

      image: {
        objectFit: "fill",
      },
      text: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
      },
      textBotton: {
        fontSize: 8,
        marginTop: "50px",
      },
    });
    let print = (
      <Document>
        <Page object-fit="fill" style={style.page} size="A4">
          <View style={style.view}>
            <Text style={style.text}>{info}</Text>
            <Image style={style.image} src={imgData} alt="images" />
            <Text style={style.textBotton}>
              {format(periodo, "PPPpp", {
                locale: brasilLocal,
              })}
            </Text>
          </View>
        </Page>
      </Document>
    );
    callback(print);
  });
};
