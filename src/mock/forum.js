import Mock from 'mockjs';

const mockForums = [
  {
    id: 1,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 2,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 3,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 4,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 5,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 6,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 7,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 8,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 9,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 10,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 11,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 12,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 13,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 14,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 15,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 16,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 17,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 18,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  },
  {
    id: 19,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 20,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 21,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  }, {
    id: 22,
    title: "毕业即失业，我做对了什么",
    preview: "学习省力的摇奶茶技巧...",
    tags: ["焦虑", "就业", "职场"],
    creator: {
      id: 75,
      username: "邵乙萍"
    },
    create_time: "2024-09-16 19:30:41",
    update_time: "2025-09-29 19:30:41"
  },
  {
    id: 23,
    title: "ecnu这个寝室全员未保研！",
    preview: "我们做到了什么...",
    tags: ["校园生活", "升学焦虑"],
    creator: {
      id: 9,
      username: "邸超"
    },
    create_time: "2025-01-29 17:14:08",
    update_time: "2025-08-07 17:14:08"
  },
  {
    id: 24,
    title: "假如给我300亿",
    preview: "谁还读这个破书",
    tags: ["压力", "焦虑"],
    creator: {
      id: 25,
      username: "叶静"
    },
    create_time: "2024-04-10 10:33:22",
    update_time: "2025-12-05 10:33:22"
  }
];


// 模拟评论数据
const mockComments = new Map();

// 获取论坛评论列表
Mock.mock(/\/api\/forums\/\d+\/comments/, 'get', (options) => {
  const url = new URL(options.url, window.location.origin);
  const page = parseInt(url.searchParams.get('page') || '1');
  const forumId = parseInt(options.url.match(/\/forums\/(\d+)\/comments/)[1]);
  const pageSize = 10;

  // 如果这个论坛还没有评论数据，生成一些
  if (!mockComments.has(forumId)) {
    const commentsCount = Mock.Random.integer(3, 30); // 至少生成3条评论
    const comments = new Array(commentsCount).fill(null).map(() => {
      // 生成回复数量（0-3条）
      const replyCount = Mock.Random.integer(0, 3);
      
      // 生成回复列表
      const replies = new Array(replyCount).fill(null).map(() => ({
        id: Mock.Random.increment(),
        user_id: Mock.Random.integer(1, 100),
        username: Mock.Random.cname(),
        content: Mock.Random.cparagraph(1, 2),
        time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        is_liked: Mock.Random.boolean(),
        liked_count: Mock.Random.integer(0, 100)
      }));

      // 生成主评论
      return {
        id: Mock.Random.increment(),
        user_id: Mock.Random.integer(1, 100),
        username: Mock.Random.cname(),
        content: Mock.Random.cparagraph(1, 3),
        time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        is_liked: Mock.Random.boolean(),
        liked_count: Mock.Random.integer(0, 100),
        reply_count: replyCount,
        reply: replies
      };
    });
    mockComments.set(forumId, comments);
  }

  const comments = mockComments.get(forumId);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedComments = comments.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      total: comments.length,
      comments: paginatedComments
    }
  };
});


// 获取论坛详情
Mock.mock(/\/api\/forums\/\d+$/, 'get', (options) => {
  console.log('hello')
  const forumId = parseInt(options.url.match(/\/forums\/(\d+)/)[1]);
  const forum = mockForums.find(f => f.id === forumId);

  if (!forum) {
    return {
      code: 404,
      message: '帖子未找到'
    };
  }

  return {
    code: 200,
    message: 'success',
    data: {
      ...forum,
      content: Mock.Random.cparagraph(10, 20) // 生成详细内容
    }
  };
});


Mock.mock(/\/api\/forums/, 'get', (options) => {
  console.log('hello wrong')
  const url = new URL(options.url, window.location.origin);
  const page = parseInt(url.searchParams.get('page') || '1');
  const keyword = url.searchParams.get('keyword');
  const tags = url.searchParams.get('tags');

  let filteredForums = [...mockForums];
  
  // 只有当关键词不为空时才进行关键词筛选
  if (keyword && keyword.trim() !== '') {
    filteredForums = filteredForums.filter(forum => 
      forum.title.includes(keyword) || forum.preview.includes(keyword)
    );
  }

  // 只有当标签不为空时才进行标签筛选
  if (tags && tags.trim() !== '') {
    const tagArray = tags.split(',');
    if (tagArray.length > 0) {
      filteredForums = filteredForums.filter(forum => 
        forum.tags.some(tag => tagArray.includes(tag))
      );
    }
  }

  const start = (page - 1) * 10;
  const end = start + 10;
  const paginatedForums = filteredForums.slice(start, end);

  return {
    data: {
      total: filteredForums.length,
      forums: paginatedForums
    }
  };
});

// 创建论坛的 mock
Mock.mock(/\/api\/forums$/, 'post', (options) => {
  const { title, content, tags } = JSON.parse(options.body);
  
  // 模拟创建新帖子
  const newForum = {
    id: mockForums.length + 1,
    title,
    creator: {
      id: 32, // 假设当前用户 ID
      username: "禹敬彪" // 假设当前用户名
    },
    create_time: new Date().toISOString().replace('T', ' ').split('.')[0]
  };

  // 将新帖子添加到 mock 数据中
  mockForums.push({
    ...newForum,
    preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    tags: tags.map(tagId => {
      const tagMap = {
        95: '焦虑',
        38: '就业',
        36: '职场',
        42: '学习',
        55: '压力',
        66: '恋爱',
        77: '家庭',
        88: '社交',
        99: '抑郁',
        100: '升学'
      };
      return tagMap[tagId] || '未知标签';
    }),
    update_time: newForum.create_time
  });

  return {
    data: newForum
  };
});

// 获取我创建的论坛列表
Mock.mock(/\/api\/forums\/create/, 'get', (options) => {
  const url = new URL(options.url, window.location.origin);
  const page = parseInt(url.searchParams.get('page') || '1');

  // 筛选当前用户创建的论坛（假设当前用户 ID 为 32）
  const myForums = mockForums.filter(forum => forum.creator.id === 32);
  
  const start = (page - 1) * 10;
  const end = start + 10;
  const paginatedForums = myForums.slice(start, end);

  return {
    data: {
      total: myForums.length,
      forums: paginatedForums
    }
  };
});

// 获取我加入的论坛列表
Mock.mock(/\/api\/forums\/join/, 'get', (options) => {
  const url = new URL(options.url, window.location.origin);
  const page = parseInt(url.searchParams.get('page') || '1');

  // 模拟一些已加入的论坛（这里简单地返回 ID 为偶数的论坛）
  const joinedForums = mockForums.filter(forum => forum.id % 2 === 0);
  
  const start = (page - 1) * 10;
  const end = start + 10;
  const paginatedForums = joinedForums.slice(start, end);

  return {
    data: {
      total: joinedForums.length,
      forums: paginatedForums
    }
  };
});





// 发表评论
Mock.mock('/api/comments', 'post', (options) => {
  const { type, target_id, content } = JSON.parse(options.body);
  const newComment = {
    id: Mock.Random.increment(),
    user_id: 32, // 假设当前用户ID
    username: "禹敬彪", // 假设当前用户名
    content,
    time: new Date().toISOString().replace('T', ' ').split('.')[0],
    is_liked: false,
    liked_count: 0,
    reply_count: 0,
    reply: []
  };

  if (type === 0) { // 对帖子的评论
    const comments = mockComments.get(target_id) || [];
    comments.unshift(newComment);
    mockComments.set(target_id, comments);
  } else if (type === 2) { // 对评论的回复
    // 遍历所有论坛的评论找到目标评论
    for (const [comments] of mockComments) {
      const targetComment = comments.find(c => c.id === target_id);
      if (targetComment) {
        targetComment.reply.unshift({
          id: Mock.Random.increment(),
          user_id: 32,
          username: "禹敬彪",
          content,
          time: new Date().toISOString().replace('T', ' ').split('.')[0],
          is_liked: false,
          liked_count: 0
        });
        targetComment.reply_count++;
        break;
      }
    }
  }

  return {
    code: 200,
    message: 'success',
    data: {
      comment_id: newComment.id,
      create_time: newComment.time
    }
  };
});

// 点赞评论
Mock.mock(/\/api\/comments\/\d+\/like/, 'post', (options) => {
  const commentId = parseInt(options.url.match(/\/comments\/(\d+)\/like/)[1]);
  
  // 遍历所有评论找到目标评论
  for (const [ comments] of mockComments) {
    for (const comment of comments) {
      if (comment.id === commentId) {
        comment.is_liked = true;
        comment.liked_count++;
        return {
          code: 200,
          message: 'success'
        };
      }
      // 检查回复中的评论
      const reply = comment.reply.find(r => r.id === commentId);
      if (reply) {
        reply.is_liked = true;
        reply.liked_count++;
        return {
          code: 200,
          message: 'success'
        };
      }
    }
  }

  return {
    code: 404,
    message: '评论未找到'
  };
});

// 取消点赞评论
Mock.mock(/\/api\/comments\/\d+\/unlike/, 'post', (options) => {
  const commentId = parseInt(options.url.match(/\/comments\/(\d+)\/unlike/)[1]);
  
  // 遍历所有评论找到目标评论
  for (const [comments] of mockComments) {
    for (const comment of comments) {
      if (comment.id === commentId) {
        comment.is_liked = false;
        comment.liked_count = Math.max(0, comment.liked_count - 1);
        return {
          code: 200,
          message: 'success'
        };
      }
      // 检查回复中的评论
      const reply = comment.reply.find(r => r.id === commentId);
      if (reply) {
        reply.is_liked = false;
        reply.liked_count = Math.max(0, reply.liked_count - 1);
        return {
          code: 200,
          message: 'success'
        };
      }
    }
  }

  return {
    code: 404,
    message: '评论未找到'
  };
}); 