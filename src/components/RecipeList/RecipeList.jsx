import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Row, Col, Popconfirm, Input } from 'antd';

import './RecipeList.css';

function RecipeList() {
  const [recipes, setRecipes] = useState({
    currentPage: 0,
    totalPages: 0,
    recipes: [],
  });

  const [deleted, setDeleted] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');

  const deleteRecipe = async id => {
    await axios.delete(`http://localhost:8081/recipes/${id}`);
    setDeleted(deleted + 1);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const fetchedRecipes = await axios(
        `http://localhost:8081/recipes/?page=${currentPage}&search=${filter}`
      );
      setRecipes(fetchedRecipes.data);
    };
    fetchRecipes();
  }, [deleted, currentPage, filter]);

  const constructListItem = item => (
    <React.Fragment>
      <div className="recipeTitle">
        <h4>{item.title}</h4>
      </div>
      <div className="recipeDelete">
        <Popconfirm
          title={`Are you sure you want to delete the recipe '${item.title}'`}
          onConfirm={() => deleteRecipe(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <button className="deleteButton">delete</button>
        </Popconfirm>
      </div>
      <div className="recipeDescription">
        {item.description}
      </div>
    </React.Fragment>
  );

  return (
    <Row type="flex" justify="center">
      <Col span={15}>
        <Row className="headerRow">
          <Col span={12}>
            <h1>Recipes Overview</h1>
            <Input
              value={filter}
              onChange={event => setFilter(event.target.value)}
              placeholder="filter"
            />
          </Col>
        </Row>
        <List
          bordered
          dataSource={recipes.recipes}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: 5 * recipes.totalPages,
            onChange: pageNumber => setCurrentPage(pageNumber),
          }}
          renderItem={item => (
            <List.Item key={item.id} className="listItem">
              {constructListItem(item)}
            </List.Item>
          )}
        ></List>
      </Col>
    </Row>
  );
}

export { RecipeList };
