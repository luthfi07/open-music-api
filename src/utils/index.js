const mapValue = ({
  id,
  name,
  year,
  cover,
  songs,
}) => ({
  id,
  name,
  year,
  coverUrl:cover,
  songs,
});

module.exports = { mapValue };
