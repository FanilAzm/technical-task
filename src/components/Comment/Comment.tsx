import * as React from "react";
import styles from "./Comment.module.scss";
import avatarImage from "../../assets/avatar.jpeg";
import likeIcon from "../../assets/like.svg";
import {CommentType} from "src/types/comments";

type ICommentProps = {
  item: CommentType;
};

const Comment: React.FC<ICommentProps> = ({item}) => {
  const year = item.created.substr(0, 4);
  const month = item.created.substr(5, 2);
  const day = item.created.substr(8, 2);
  const time = item.created.substr(11, 8);

  const createdMilliseconds = Date.now() - Date.parse(item.created);
  const hours = Math.floor((createdMilliseconds / (1000 * 60 * 60)) % 24);
  const dayMilliseconds = 86400000;

  // Ф-ия склонения слов в зависимости от приходящего числа
  function decOfNum(number: number, titles: string[]) {
    let decCache: number[] = [];
    let decCases = [2, 0, 1, 1, 1, 2];

    if (!decCache[number])
      decCache[number] =
        number % 100 > 4 && number % 100 < 20
          ? 2
          : decCases[Math.min(number % 10, 5)];
    return titles[decCache[number]];
  }

  return (
    <div className={styles.item}>
      <div className={styles.avatar}>
        <img src={item.avatar ? item.avatar : avatarImage} alt="avatar" />
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.author}>
            <p className={styles.authorName}>{item.name}</p>
            <p className={styles.date}>
              {createdMilliseconds > dayMilliseconds
                ? day + "." + month + "." + year + ", " + time
                : `${hours} ${decOfNum(hours, ["час", "часа", "часов"])} назад`}
            </p>
          </div>
          <div className={styles.action}>
            <img src={likeIcon} alt="like" />
            <p>{item.likes}</p>
          </div>
        </div>
        <p className={styles.text}>{item.text}</p>
      </div>
    </div>
  );
};

export default Comment;
