const getAllTags = useCallback(async () => {
  try {
    let allTags = [];
    const response = await axiosPrivate.get("/item/tags");
    console.log("getAllTags", response.data);

    response.data.forEach((item) => {
      item.tags.forEach((tag) => {
        console.log(tag);
        allTags.push(tag);
      });
    });
    console.log("tags", allTags);

    const key = "label";

    const uniqueTags = [
      ...new Map(allTags.map((tag) => [tag[key], tag])).values(),
    ];

    console.log("unique tags", uniqueTags);
  } catch (error) {
    console.log(error);
  }
}, [axiosPrivate]);
