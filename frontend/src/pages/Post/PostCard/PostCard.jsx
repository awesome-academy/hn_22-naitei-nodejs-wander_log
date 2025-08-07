import React, { useState, useEffect, useRef } from "react";
import styles from "./PostCard.module.css";
import { Link } from "react-router-dom";
import avatarDefault from "../../../assets/images/default_avatar.png";
import TimeAgo from "../../../component/TimeAgo";

const PostCard = ({
  post,
  onEdit,
  onDelete,
  isEditing,
  onCancelEdit,
  onSubmitEdit,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isEditing) {
      setEditedContent(post.content);
    }
  }, [isEditing, post.content]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseLightbox();
      }
      if (e.key === "ArrowRight") {
        handleNextImage();
      }
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      }
    };

    if (isLightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, currentImageIndex]);

  const handleEditClick = () => {
    onEdit(post);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
    setIsMenuOpen(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() === "") {
      alert("Content cannot be empty.");
      return;
    }
    onSubmitEdit({ id: post.id, content: editedContent });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.media.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + post.media.length) % post.media.length
    );
  };

  const stopPropagation = (e) => e.stopPropagation();

  const renderImages = () => {
    if (!post.media || post.media.length === 0) {
      return null;
    }

    if (post.media.length === 1) {
      return (
        <img
          src={post.media[0].url}
          alt="Post media"
          className={styles.imageSingle}
          onClick={() => handleImageClick(0)}
        />
      );
    }

    if (post.media.length === 2) {
      return (
        <div className={styles.imageGridTwo}>
          {post.media.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Post image ${index + 1}`}
              className={styles.imageGridItem}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className={styles.imageGridTwo}>
        <img
          src={post.media[0].url}
          alt="Post image 1"
          className={styles.imageGridItem}
          onClick={() => handleImageClick(0)}
        />
        <div
          className={styles.imageGridMore}
          onClick={() => handleImageClick(1)}
        >
          <img
            src={post.media[1].url}
            alt="More post images"
            className={styles.imageGridItem}
          />
          <div className={styles.imageOverlay}>
            <span>+{post.media.length - 1}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <img
            src={post.user.avatar || avatarDefault}
            alt={post.user.name}
            className={styles.avatar}
          />
          <div>
            <div className={styles.authorNameWrapper}>
              <div className={styles.authorName}>{post.user.name}</div>
            </div>
            <div className={styles.metaInfo}>
              <TimeAgo timestamp={post.createdAt} />
            </div>
          </div>
        </div>
        <div ref={menuRef} className={styles.moreButtonContainer}>
          <button
            className={styles.moreButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={styles.iconWrapper}>
              <i className="ri-more-line"></i>
            </div>
          </button>
          {isMenuOpen && (
            <div className={styles.optionsPopup}>
              <ul>
                <li onClick={handleEditClick}>
                  <i className="ri-pencil-line"></i>
                  <span>Edit</span>
                </li>
                <li onClick={handleDeleteClick} className={styles.deleteOption}>
                  <i className="ri-delete-bin-line"></i>
                  <span>Delete</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {post.itinerary && (
        <div className={styles.tripSection}>
          <Link to={`/itinerary/${post.id}`} className={styles.tripLink}>
            <div className={styles.tripContent}>
              <div className={styles.iconWrapperSmall}>
                <i className={`ri-route-line ${styles.tripIcon}`}></i>
              </div>
              <span className={styles.tripTitle}>{post.itinerary.title}</span>
              <span className={styles.tripBudget}>
                {post.itinerary.budget} VND
              </span>
              <div className={styles.tripArrow}>
                <i className="ri-arrow-right-line"></i>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className={styles.contentSection}>
        {isEditing ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className={styles.editTextarea}
            />
            <div className={styles.editActions}>
              <button
                className={`${styles.editButton} ${styles.saveButton}`}
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className={`${styles.editButton} ${styles.cancelButton}`}
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className={styles.postContent}>{post.content}</p>
        )}
      </div>

      {post.media && post.media.length > 0 && (
        <div className={styles.imagesSection}>{renderImages()}</div>
      )}

      <div className={styles.statsSection}>
        <div className={styles.statsWrapper}>
          <div className={styles.statsLeft}>
            <span className={styles.likesCount}>
              <div className={styles.iconWrapperSmall}>
                <i className={`ri-heart-fill ${styles.likeIcon}`}></i>
              </div>
              <span>{likesCount}</span>
            </span>
            <button
              onClick={() => setShowComments(!showComments)}
              className={styles.statsButton}
            >
              {post.comments} comments
            </button>
          </div>
          <span>{post.shares} shares</span>
        </div>
      </div>

      <div className={styles.actionsSection}>
        <div className={styles.actionsWrapper}>
          <button
            onClick={handleLike}
            className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
          >
            <div className={styles.iconWrapper}>
              <i className={isLiked ? "ri-heart-fill" : "ri-heart-line"}></i>
            </div>
            <span>Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={styles.actionButton}
          >
            <div className={styles.iconWrapper}>
              <i className="ri-chat-1-line"></i>
            </div>
            <span>Comment</span>
          </button>
          <button className={styles.actionButton}>
            <div className={styles.iconWrapper}>
              <i className="ri-share-line"></i>
            </div>
            <span>Share</span>
          </button>
        </div>
      </div>

      {showComments && <div className={styles.commentsSection}></div>}

      {isLightboxOpen && post.media && post.media.length > 0 && (
        <div className={styles.lightboxOverlay} onClick={handleCloseLightbox}>
          <button
            className={`${styles.lightboxButton} ${styles.closeButton}`}
            onClick={handleCloseLightbox}
          >
            <i className="ri-close-line"></i>
          </button>
          <button
            className={`${styles.lightboxButton} ${styles.prevButton}`}
            onClick={(e) => {
              stopPropagation(e);
              handlePrevImage();
            }}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <div className={styles.lightboxContent} onClick={stopPropagation}>
            <img
              src={post.media[currentImageIndex].url}
              alt={`View ${currentImageIndex + 1}`}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCounter}>
              {currentImageIndex + 1} / {post.media.length}
            </div>
          </div>
          <button
            className={`${styles.lightboxButton} ${styles.nextButton}`}
            onClick={(e) => {
              stopPropagation(e);
              handleNextImage();
            }}
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
