import * as React from "react";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import useMockAdapter from "src/api/useMockAdapter";
import {AuthorType} from "src/types/authors";
import {CommentsType, CommentType} from "src/types/comments";
import Comment from "../Comment/Comment";
import Layout from "../Layout/Layout";
import styles from "./Comments.module.scss";

type ICommentsProps = {};

const Comments: React.FC<ICommentsProps> = () => {
  const [authors, setAuthors] = React.useState([]);
  const [comments, setComments] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [fetching, setFetching] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    getAuthorsRequest().then((res) => setAuthors(res));
    if (fetching) {
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

  // console.log(pageCount);

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

  // console.log(sortComments);

  return (
    <Layout>
      <div className={styles.commentsTop}>
        <p>{comments.length} комментариев</p>
        <p>8 632</p>
      </div>
      <div className={styles.comments}>
        {comments &&
          sortComments.map((item: any) => {
            return (
              <div key={item.id}>
                {!item.parent && <Comment item={item} />}
                {item.parent && (
                  <div style={{marginLeft: "34px", marginBottom: "32px"}}>
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
