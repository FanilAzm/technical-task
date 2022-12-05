import * as React from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import {IAuthor} from "src/types/authors";
import {IComment} from "src/types/comments";
import Comment from "../Comment/Comment";
import Layout from "../Layout/Layout";
import styles from "./Comments.module.scss";
import likesSumIcon from "../../assets/sum-likes.svg";

type ICommentsProps = {};

const Comments: React.FC<ICommentsProps> = () => {
  const [authors, setAuthors] = React.useState<IAuthor[]>([]);
  const [comments, setComments] = React.useState<IComment[]>([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [fetching, setFetching] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);

  console.log(pageCount);

  // Получаем данные авторов
  React.useEffect(() => {
    getAuthorsRequest().then((res) => setAuthors(res));
  }, []);

  // Получаем данные комментариев
  React.useEffect(() => {
    let ignore = false;

    if (fetching) {
      getCommentsRequest(pageCount)
        .then((res) => {
          if (!ignore) {
            setComments([...comments, ...res.data]);
            setPageCount((prevState) => prevState + 1);
            setTotalCount(res.pagination.total_pages);
            toast.success("Комментарии загружены");
          }
        })
        .catch((error) =>
          toast.error("Не удалось загрузить комментарий, попробуйте ещё раз"),
        )
        .finally(() => setFetching(false));
    }

    return () => {
      ignore = true;
    };
  }, [fetching]);

  // Объединяем массивы комментариев и авторов в один
  const sortComments = comments
    .map((comment: IComment) => {
      const withCurrentId = authors.filter(
        (author) => author["id"] === comment["author"],
      );

      const author = withCurrentId.reduce((acc: any, curr: any) => {
        acc.name = curr.name;
        acc.avatar = curr.avatar;

        return acc;
      }, {});

      return {...comment, ...author};
    })
    .sort((x, y) => Date.parse(x.created) - Date.parse(y.created));

  // Считаем сумму лайков
  const sumOfLikes = sortComments
    .map((item: IComment) => item.likes)
    .reduce((acc, number) => acc + number, 0);

  return (
    <Layout>
      <div className={styles.commentsTop}>
        <p>{comments.length} комментариев</p>
        <div className={styles.commentsTopLikes}>
          <img src={likesSumIcon} alt="all likes" />
          <p>{sumOfLikes}</p>
        </div>
      </div>
      <div className={styles.comments}>
        {comments &&
          sortComments.map((item: IComment) => {
            return (
              <div key={item.id}>
                {!item.parent && <Comment item={item} />}
                {item.parent && (
                  <div className={styles.childComment}>
                    <Comment item={item} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {totalCount >= pageCount ? (
        <div>
          <button onClick={() => setFetching(true)} className={styles.button}>
            Загрузить еще
          </button>
          <ToastContainer />
        </div>
      ) : null}
    </Layout>
  );
};

export default Comments;
