import * as React from "react";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import {AuthorType} from "src/types/authors";
import {CommentType} from "src/types/comments";
import Comment from "../Comment/Comment";
import Layout from "../Layout/Layout";
import styles from "./Comments.module.scss";
import likesSumIcon from "../../assets/sum-likes.svg";

type ICommentsProps = {};

const Comments: React.FC<ICommentsProps> = () => {
  const [authors, setAuthors] = React.useState<AuthorType[]>([]);
  const [comments, setComments] = React.useState<CommentType[]>([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [fetching, setFetching] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);

  // Получаем данные авторов
  React.useEffect(() => {
    getAuthorsRequest().then((res) => setAuthors(res));
  }, []);

  // Получаем данные комментариев
  React.useEffect(() => {
    if (fetching) {
      // fetching выводится 2 раза, не пойму почему...
      console.log("fetching");
      getCommentsRequest(pageCount)
        .then((res) => {
          setComments([...comments, ...res.data]);
          setPageCount((prevState) => prevState + 1);
          setTotalCount(res.pagination.total_pages);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  // Объединяем массивы комментариев и авторов в один
  const sortComments = comments
    .map((comment: CommentType) => {
      const withCurrentId = authors.filter(
        (author) => author["id"] === comment["author"],
      );

      const author = withCurrentId.reduce((acc: any, curr: any) => {
        acc["name"] = curr["name"];
        acc["avatar"] = curr["avatar"];

        return acc;
      }, {});

      return {...comment, ...author};
    })
    .sort((x, y) => Date.parse(x.created) - Date.parse(y.created));

  // Считаем сумму лайков
  const sumOfLikes = sortComments
    .map((item: CommentType) => item.likes)
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
          sortComments.map((item: CommentType) => {
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
        <button onClick={() => setFetching(true)} className={styles.button}>
          Загрузить еще
        </button>
      ) : null}
    </Layout>
  );
};

export default Comments;
