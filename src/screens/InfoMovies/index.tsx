import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import firestore from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, useWindowDimensions } from "react-native";
import {
  AlignStar,
  Assessment,
  BackgroundHeader,
  ButtonClose,
  Container,
  Header,
  IconClose,
  ImageArea,
  InfosMovie,
  StarIcon,
  TitleAndDescription,
  VoteAverage,
  Title,
  ButtonFavorite,
  IconStarButtonFavorite,
  TextButtonFavorite,
  Synopsis,
  TiltleSynopsis,
  OverviewSynopsis,
  ReleaseDateArea,
  TitleReleaseDate,
  ReleaseDate,
} from "./style";

type ProfileScreenParams = {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  release_date: string;
};

type ProfileScreenRouteProp = RouteProp<
  { ProfileScreen: ProfileScreenParams },
  "ProfileScreen"
>;

export function InfoMovies() {
  const window = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute<ProfileScreenRouteProp>();
  const [favorites, setFavorites] = useState(true);
  const [notification, setNotification] = useState(false);

  const {
    id,
    title,
    overview,
    vote_average,
    backdrop_path,
    poster_path,
    release_date,
  } = route.params;

  const date = release_date;
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const dateFormated = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  async function handleDoneToggle() {
    const moviesRef = firestore().collection("Filmes");
    moviesRef
      .doc(`${id}`)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          moviesRef
            .doc(`${id}`)
            .update({ favorite: !favorites })
            .then(() => console.log("Lista atualizada"))
            .catch((error) =>
              console.error("Erro ao atualizar filme: ", error)
            );
        } else {
          moviesRef
            .doc(`${id}`)
            .set({
              id: `${id}`,
              title: title,
              poster_path: poster_path,
              vote_average: vote_average,
              favorite: true,
            })
            .then(() => setNotification(true))
            .catch((error) =>
              console.error("Erro ao cadastrar filme: ", error)
            );
        }
      })
      .catch((error) =>
        console.error(
          "Erro ao verificar se o filme já está cadastrado: ",
          error
        )
      );

    if (notification === true) {
      const trigger = new Date(Date.now());
      trigger.setMinutes(trigger.getMinutes() + 1);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Muito bem!",
          body: "Você acaba de adicionar um filme aos favoritos."
        },
        trigger
      })
      setNotification(false);
    }
  }

  useEffect(() => {
    const moviesRef = firestore().collection("Filmes");
    moviesRef.doc(`${id}`).onSnapshot((doc) => {
      const favorite = doc.exists && doc.data()?.favorite;
      setFavorites(favorite || false);
    });
  }, [`${id}`]);

  return (
    <Container>
      <Header>
        <BackgroundHeader
          source={{ uri: `https://image.tmdb.org/t/p/w500${backdrop_path}` }}
          style={{ width: window.width, height: "100%" }}
        />
        <ButtonClose activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <IconClose name="closecircle" />
        </ButtonClose>
      </Header>
      <InfosMovie>
        <ImageArea
          source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
          style={{
            width: "40%",
            height: 260,
            borderRadius: 20,
            marginTop: -60,
          }}
        />
        <TitleAndDescription>
          <Title>{title}</Title>
          <Assessment>
            <AlignStar>
              <StarIcon name="star" />
            </AlignStar>
            <VoteAverage>{vote_average}/10</VoteAverage>
          </Assessment>
          <ReleaseDateArea>
            <TitleReleaseDate>Data de lançamento: </TitleReleaseDate>
            <ReleaseDate>{dateFormated}</ReleaseDate>
          </ReleaseDateArea>
          <ButtonFavorite onPress={handleDoneToggle}>
            <IconStarButtonFavorite
              style={favorites ? { color: "#EEAD2D" } : { color: "#000000" }}
              name={favorites ? "star" : "staro"}
            />
            <TextButtonFavorite>
              {favorites ? "Favoritado" : "Favoritar"}
            </TextButtonFavorite>
          </ButtonFavorite>
        </TitleAndDescription>
      </InfosMovie>
      <Synopsis>
        <TiltleSynopsis>Sobre o filme:</TiltleSynopsis>
        <ScrollView showsVerticalScrollIndicator={false}>
          <OverviewSynopsis>{overview}</OverviewSynopsis>
        </ScrollView>
      </Synopsis>
    </Container>
  );
}
