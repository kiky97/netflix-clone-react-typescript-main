import {
  LoaderFunctionArgs,
  useLoaderData,
  // useParams
} from "react-router-dom";
import { COMMON_TITLES } from "src/constant";
import GridPage from "src/components/GridPage";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import {
  genreSliceEndpoints,
  // useGetGenresQuery
} from "src/store/slices/genre";
import store from "src/store";

export async function loader({ params }: LoaderFunctionArgs) {
  /////定义了一个loader, 先准备好数据，
  let genre: CustomGenre | Genre | undefined = COMMON_TITLES.find(
    (t) => t.apiString === (params.genreId as string)
  );
  ////CustomGenre类型名字，Genre
  if (!genre) {
    const genres = await store
      .dispatch(genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie))
      .unwrap();
    genre = genres?.find((t) => t.id.toString() === (params.genreId as string));
  }
  //dispatch 是我要做什么告诉store, 
  你（Component）
        │
        │ "我要获取电影分类"
        ▼
dispatch(...)
        │
        ▼
Redux Store
        │
        ▼
发送请求
        │
        ▼
服务器
        │
        ▼
返回数据
        │
        ▼
Redux 保存数据///

  return genre;
}

export function Component() {
  const genre: CustomGenre | Genre | undefined = useLoaderData() as
    | CustomGenre
    | Genre
    | undefined;
  // const { genreId } = useParams();
  // const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  // let genre: Genre | CustomGenre | undefined;
  // if (isNaN(parseInt(genreId!))) {
  //   genre = COMMON_TITLES.find((t) => t.apiString === genreId);
  // } else {
  //   genre = genres?.find((t) => t.id.toString() === genreId);
  // }
  if (genre) {
    return <GridPage mediaType={MEDIA_TYPE.Movie} genre={genre} />;
  }
  return null;
}

Component.displayName = "GenreExplore";
